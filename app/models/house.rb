class House < ActiveRecord::Base
    acts_as_mappable :default_units => :kms, 
                       :default_formula => :flat, 
                       :distance_field_name => :distance
end