Rails.application.routes.draw do
	
	scope "/interfaces" do
		resources :flexible_interface do
			get	:manifest,	:on => :member
			get	:alt,	:on => :member
		end
	end
	
end
