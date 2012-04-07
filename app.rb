require 'sinatra'

set :views, "#{settings.root}/app/views/"

get '/' do
  erb :index, :layout => :'layouts/application'
end

get '/about' do
  erb :about, :layout => :'layouts/application'
end

get '/privacy' do
  erb :privacy, :layout => :'layouts/application'
end
