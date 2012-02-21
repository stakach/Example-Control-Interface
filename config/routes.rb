Rails.application.routes.draw do
	
	scope "/interfaces" do
		resources :flexible do
			get	:manifest,	:on => :member
			get	:alt,	:on => :member
		end
	end
	
end
