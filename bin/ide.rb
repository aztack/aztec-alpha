# encoding:utf-8
require 'sinatra'
root = File.dirname(__FILE__)
set :public_folder,  "#{root}/ide/static"
set :views, "#{root}/ide/views"

get '/' do 
	erb :hello
end

__END__

@@hello
<h1>Hello <%=@agent%> from Sinatra</h1>