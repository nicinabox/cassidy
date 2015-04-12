var connect = require('connect')
var http = require('http')
var serveStatic = require('serve-static')

var PORT = 8000;
var app = connect()

app.use(serveStatic(__dirname + '/public'))
app.use(serveStatic(__dirname))

http.createServer(app).listen(PORT)
console.log('Server is running on port ' + PORT);
