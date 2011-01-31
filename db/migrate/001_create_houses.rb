class CreateHouses < ActiveRecord::Migration
  def self.up
    create_table :houses do |t|
      t.string :title
      t.string :icon
      t.float :lng
      t.float :lat

      t.timestamps
    end
  end

  def self.down
    drop_table :houses
  end
end