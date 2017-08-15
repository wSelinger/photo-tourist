class Inquiry < ActiveRecord::Base
  include Protectable
  validates :title, :creator_id, :presence=>true
end
