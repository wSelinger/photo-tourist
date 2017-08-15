json.extract! inquiry, :id, :title, :description, :creator_id, :created_at, :updated_at
json.internal_notes inquiry.internal_notes if is_admin?
json.url inquiry_url(inquiry, format: :json)
