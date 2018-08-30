var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var tjbotList = {};
var browserList = {};
var socketList = {};

app.use(function (req, res, next) {
	  res.io = io;
	  next();
}); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

io.on('connection', function (socket) {

	console.log("Sockets connected.with id " + socket.id);

	socket.emit('start', 'Socket started');
	
	socket.on('browser', function() {
		browserList[socket.id] = socket;
		socket.emit('botlist', getJSONBotList(tjbotList));
	});

	// Whenever a new client connects send them the latest data
	socket.on('checkin', function(data) {
		tjbotList[socket.id] = JSON.parse(data);
		socketList[socket.id] = socket;
		notifyBrowser();
	});


	socket.on('disconnect', function () {
		console.log("Socket disconnected.");
		if (socket.id in tjbotList) {
			delete tjbotList[socket.id]
			notifyBrowser();
		} else if (socket.id in browserList) {
			delete browserList[socket.id];
		} else {
			console.log(socket.id + " not found");
		}
	});

	socket.on('update', function (data) {
		param = JSON.parse(data);
		socketList[param.socket_id].emit('update', param.target);
	});

});

function getJSONBotList(list) {
	return JSON.stringify(Object.keys(list).map(function(key){
		blist = list[key]
		blist.socket_id = key;
		return blist;
	}));
}

function notifyBrowser() {
	list = getJSONBotList(tjbotList);
	Object.keys(browserList).forEach(function(key) {
		browserList[key].emit('botlist', list);
	});
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};

