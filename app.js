/**
 *	app.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

//const log = require('./lib/log.js')(path.basename(__filename));

const BotManager = require('./classes/botManager.js');

/*----------------------------------------------------------------------------*/
/* DECLARATION AND INITIALIZATION                                             */
/*----------------------------------------------------------------------------*/

let vcapServices;

// try getting Bluemix VCAP_SERVICES object or load local VCAP configuration
try {
	vcapServices = JSON.parse(process.env.VCAP_SERVICES);
} catch(err) {
	vcapServices = require('./vcap-local.json').services;
	console.log("Loaded local VCAP", vcapServices.services);
}


let botManager = new BotManager(vcapServices);

/*----------------------------------------------------------------------------*/
/* MAIN                                                                       */
/*----------------------------------------------------------------------------*/
io.on('connection', function (socket) {
	console.log("Sockets connected.with id " + socket.id);

	socket.emit('start', 'Socket started');

	socket.on('browser', function() {
		botManager.registerBrowser(socket);
		socket.emit('botlist', botManager.getJSONBotList());
	});

	// Whenever a new client connects send the browser an updated list
	socket.on('checkin', function(data) {
		botManager.addBotToList(data, socket);
		socket.emit('vcapServices', vcapServices); // sends the VCAP_SERVICES to the client
		socket.emit('config', botManager.getConfigList(socket.id)); // sends a list of all available configs to the client
	});

	/*socket.on('update', function (data) {
		param = JSON.parse(data);
		console.log("update: " + param.serial);
		browserSocket = botManager.getSocket(param.serial).emit('update', param.target);
	});*/

	socket.on('save', function(data) {
		param = JSON.parse(data);
		console.log("Save " + param.serial);
		botManager.updateField(param);
	});

	socket.on('event', function(data) {
		let param = JSON.parse(data);
		console.log("update: " + param.serial);

		let socket = botManager.getSocket(param.serial);
		if (socket != null) {
			socket.emit('event', JSON.stringify(param.event));
		} else {
			// error handling serial not found
		}

		socket.on('disconnect', function () {
			console.log("Socket disconnected.");
			botManager.disconnectSocket(socket.id);
		});

	});

	socket.on('config', function(data) {
		param = JSON.parse(data);
		console.log("update: " + param.serial);
		botManager.updateConfig(param)
		//botManager.updateConfig(param.event.target.config)
		botManager.getSocket(param.serial).emit('event', JSON.stringify(param.event));
	});

});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Auslagern
app.get('/botImageList', (req, res) => res.json(botManager.getBotImageList()));
app.get('/serviceOptionList', (req, res) => res.json(botManager.getOptionList()));

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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

app.use(function (req, res, next) {
	  res.io = io;
	  next();
});

/*----------------------------------------------------------------------------*/
/* EXPORTS                                                                    */
/*----------------------------------------------------------------------------*/

module.exports = {app: app, server: server};
