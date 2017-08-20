class DeviseSessionsController < DeviseTokenAuth::SessionsController

  # adds image_content_url to devise response if user has an image_id
  # See https://github.com/lynndylanhurley/devise_token_auth/blob/master/README.md
  # and https://github.com/lynndylanhurley/devise_token_auth/issues/597

  def render_create_success
    user = @resource

    response = user.token_validation_response
    response[:image_url] = image_content_url(user.image_id) if user.image_id

    render json: {
      data: resource_data(resource_json: response)
    }
  end

end
