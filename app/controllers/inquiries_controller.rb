class InquiriesController < ApplicationController
  before_action :set_inquiry, only: [:show, :update, :destroy]
  #before_action :fake_auth
  before_action :authenticate_user!, only: [:create, :update, :destroy]

  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  include ActionController::Helpers
  helper ThingsHelper

  #def fake_auth
    # id aus http header ?
  #  @current_user = User.find(3)
  #  pp @current_user
  #  sign_in @current_user
  #end

  # GET /inquiries
  # GET /inquiries.json
  def index
    authorize Inquiry
    filter_scope =
    filtered = InquiryPolicy::Scope.new(current_user, Inquiry.all).filter
    @inquiries = InquiryPolicy.merge(policy_scope(filtered))
end

  # GET /inquiries/1
  # GET /inquiries/1.json
  def show
    authorize @inquiry
    inquiry_with_roles = policy_scope(Inquiry.where(:id=>@inquiry.id))
    @inquiry = InquiryPolicy.merge(inquiry_with_roles).first
  end

  # POST /inquiries
  # POST /inquiries.json
  def create
    authorize Inquiry
    @inquiry = Inquiry.new(filter_create_params(inquiry_params))
    @inquiry.creator_id=current_user.id

    User.transaction do
      if @inquiry.save
        role=current_user.add_role(Role::ORGANIZER, @inquiry)
        @inquiry.user_roles << role.role_name
        role.save!
        render json: @inquiry, status: :created, location: @inquiry
      else
        render json: @inquiry.errors, status: :unprocessable_entity
      end
    end

  end

  # PATCH/PUT /inquiries/1
  # PATCH/PUT /inquiries/1.json


  def update
    authorize @inquiry
    @inquiry = Inquiry.find(params[:id])

    if @inquiry.update(filter_update_params(inquiry_params))
      head :no_content
    else
      render json: @inquiry.errors, status: :unprocessable_entity
    end
  end

  # DELETE /inquiries/1
  # DELETE /inquiries/1.json
  def destroy
    authorize @inquiry
    @inquiry.destroy

    head :no_content
  end

  private

    def set_inquiry
      @inquiry = Inquiry.find(params[:id])
    end

    def inquiry_params
      params.require(:inquiry).permit(:title, :description, :internal_notes)
    end

    # NOTE: Special attribute level update rule:
    # admin may only update internal_notes (except he is organizer)
    # organizer must not update internal_notes
    # TODO should go into policy (especially for canUpdateStandardFields-check)
    def filter_update_params(inquiry_params)
      current_user.is_admin? ? inquiry_params : inquiry_params.except(:internal_notes)
    end

    def filter_create_params(inquiry_params)
      inquiry_params.except(:internal_notes)
    end
end
