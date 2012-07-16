class FlexibleInterfaceController < TokensController
	
	def show
		@system = params[:id]
		render :layout => 'flexible'
	end
	
	def alt
		@system = params[:id]
		render :layout => 'flexible'
	end
	
	def manifest
		@last_updated = Time.at(1320700950)
		@system = params[:id]

		if stale?(:last_modified => @last_updated.utc, :etag => @last_updated.to_i)
			render :content_type => 'text/cache-manifest'
		end
	end
	
end
