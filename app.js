const express      = require('express'),
      app          = express(),
      //server       = require('http').createServer(app),
      cookieParser = require('cookie-parser'),
      path         = require('path');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

hbs = require('express-handlebars');
app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: 'views/layouts/',
  partialsDir: 'views/partials/',
  helpers: {
    equals: function (a, b, options) {
      return a == b ? options.fn(this) : options.inverse(this);
    },

  }
}));

app.set('view engine', 'hbs');




// create a http server instance to listen to request
var server = require('http').createServer(app);
var ExpressPeerServer = require('peer').ExpressPeerServer;

var options = {
  host: 'localhost',
  debug: true
}
// peerjs is the path that the peerjs server will be connected to.
app.use('/peerjs', ExpressPeerServer(server, options));
// Now listen to your ip and port.
server.listen(3000, 'localhost');

const front = require('./routes/test.js');
app.use('/test', front);

// server.listen(3000);
