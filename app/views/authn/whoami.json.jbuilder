if @user
  json.extract! @user, :id, :provider, :uid, :name, :email
  json.image_content_url image_content_url(@user.image_id) if @user.image_id
  json.user_roles @roles do |role|
    json.role_name role[0]
    json.resource role[1]  if role[1]
  end
end
