module Rack

  class TryStatic

    def initialize(app, options)
      @app = app
      @try = ['', *options.delete(:try)]
      @static = ::Rack::Static.new(lambda { [404, {}, []] }, options)
    end

    def call(env)
      orig_path = env['PATH_INFO']
      found = nil
      @try.each do |path|
        resp = @static.call(env.merge!({'PATH_INFO' => orig_path + path}))
        break if 404 != resp[0] && found = resp
      end
      found or @app.call(env.merge!('PATH_INFO' => orig_path))
    end
  end
end

use Rack::TryStatic, :root => "public", :urls => %w[/], :try => ['.html', 'index.html', '/index.html']

# Run your own Rack app here or use this one to serve 404 messages:
run lambda{ |env| [ 404, { 'Content-Type'  => 'text/html' }, ['404 - page not found'] ] }