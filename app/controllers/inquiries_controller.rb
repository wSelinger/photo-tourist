class InquiriesController < ApplicationController
  before_action :set_inquiry, only: [:show, :update, :destroy]
  before_action :fake_auth
  before_action :authenticate_user!, only: [:create, :update, :destroy]

  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  include ActionController::Helpers
  helper ThingsHelper

  def fake_auth
    # id aus http header ?
    @current_user = User.find(3)
    pp @current_user
    sign_in @current_user
  end


  # GET /inquiries
  # GET /inquiries.json
  def index
    authorize Inquiry
    @inquiries = policy_scope(Inquiry.all)
end

  # GET /inquiries/1
  # GET /inquiries/1.json
  def show
    authorize @inquiry
  end

  # POST /inquiries
  # POST /inquiries.json
  def create
    authorize Inquiry
    @inquiry = Inquiry.new(inquiry_params.except(:internal_notes))
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

    if @inquiry.update(inquiry_params)
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
      params.require(:inquiry).permit(:title, :description, :internalNotes)
    end
end
