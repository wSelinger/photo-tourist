class CreateInquiries < ActiveRecord::Migration
  def change
    create_table :inquiries do |t|
      t.string :title, {null: false}
      t.text :description
      t.integer :creator_id, {null: false}
      t.text :internal_notes

      t.timestamps null: false
    end
    add_index :inquiries, :creator_id
  end
end
