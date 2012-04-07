require 'sinatra'

set :views, "#{settings.root}/app/views/"

get '/' do
  erb :index, :layout => :'layouts/application'
end

get '/about' do
  erb :about, :layout => :'layouts/application'
end

get '/privacy-policy' do
  erb :'privacy-policy', :layout => :'layouts/application'
end
