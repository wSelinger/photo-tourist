class InquiryPolicy < ApplicationPolicy
  def index?
    @user
  end
  def show?
    organizer_or_admin?
  end
  def create?
    @user
  end
  def update?
    organizer_or_admin?
  end
  def destroy?
    organizer_or_admin?
  end

  class Scope < Scope
    def filter
      if @user.is_admin?
        scope
      else
        model_name='Inquiry'
        role_name=Role::ORGANIZER
        exists_clause="exists(select 1 from roles r where r.user_id = #{@user.id} and r.mid = inquiries.id and r.mname = '#{model_name}' and r.role_name = '#{role_name}')"
        scope.where(exists_clause)
      end
    end

    def user_roles
      join_roles = "left join roles ro on ro.mname = 'Inquiry' and ro.mid=Inquiries.id and ro.user_id = #{@user.id}"
      scope.select("Inquiries.*, ro.role_name").joins(join_roles)
    end

    def resolve
      user_roles
    end
  end
end
