const fs           = require('fs'),
      express      = require('express'),
      app          = express(),
      server       = require('http').createServer(app),
      cookieParser = require('cookie-parser'),
      path         = require('path'),
      s            = require('./server.js');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// x forwared for directive
app.enable('trust proxy');

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

hbs = require('express-handlebars');
app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: 'views/',
  layoutsDir: 'views/layouts/',
  helpers: {
    equals: function (arg1, arg2, options) { return arg1 === arg2 ? options.fn(this) : options.inverse(this); },
  }
}));

app.set('view engine', 'hbs');

const front    = require('./routes/front.js'),
      running  = require('./routes/running.js'),
      contact  = require('./routes/contact.js'),
      books    = require('./routes/books.js'),
      stuff    = require('./routes/stuff.js'),
      thoughts = require('./routes/thoughts.js');

app.use('/', front);
app.use('/running', running);
app.use('/contact', contact);
app.use('/books', books);
app.use('/stuff', stuff);
app.use('/thoughts', thoughts);

app.use(function (req, res) {
  res.redirect('/');
});

var io = require('socket.io').listen(server, {
    log: true,
    origins: '*:*'
});

io.set('transports', [
    'websocket',
    'polling'
    // 'xhr-polling',
    // 'jsonp-polling'
]);

var channels = {};

io.sockets.on('connection', function (socket) {
    console.log('connection')
    var initiatorChannel = '';
    if (!io.isConnected) {
        io.isConnected = true;
    }

    socket.on('new-channel', function (data) {
      console.log('new channel')
        if (!channels[data.channel]) {
            initiatorChannel = data.channel;
        }

        channels[data.channel] = data.channel;
        onNewNamespace(data.channel, data.sender);
    });

    socket.on('presence', function (channel) {
        var isChannelPresent = !! channels[channel];
        socket.emit('presence', isChannelPresent);
    });

    socket.on('disconnect', function (channel) {
        if (initiatorChannel) {
            delete channels[initiatorChannel];
        }
    });
});

function onNewNamespace(channel, sender) {
    io.of('/' + channel).on('connection', function (socket) {
        var username;
        if (io.isConnected) {
            io.isConnected = false;
            socket.emit('connect', true);
        }

        socket.on('message', function (data) {
            if (data.sender == sender) {
                if(!username) username = data.data.sender;

                socket.broadcast.emit('message', data.data);
            }
        });

        socket.on('disconnect', function() {
            if(username) {
                socket.broadcast.emit('user-left', username);
                username = null;
            }
        });
    });
}

server.listen(3000);
