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
const ServiceManager = require('./classes/serviceManager.js');

/*----------------------------------------------------------------------------*/
/* DECLARATION AND INITIALIZATION                                             */
/*----------------------------------------------------------------------------*/

let vcapServices;

// try getting Bluemix VCAP_SERVICES object or load local VCAP configuration
try {
	vcapServices = JSON.parse(process.env.VCAP_SERVICES);
} catch(err) {
	vcapServices = require('./vcap-local.json');
	console.log("Loaded local VCAP", vcapServices);
}


if (vcapServices.cloudantNoSQLDB == null) {
	console.log("No Cloudant DB services connected");
	throw new Error("No Cloudant DB services connected");
}

let botManager = new BotManager(vcapServices.cloudantNoSQLDB[0]);
botManager.init(handleError);

delete vcapServices.cloudantNoSQLDB;

let serviceManager = new ServiceManager(vcapServices);

/*----------------------------------------------------------------------------*/
/* MAIN                                                                       */
/*----------------------------------------------------------------------------*/
io.on('connection', function (socket) {
	console.log("Sockets connected with id " + socket.id);

	socket.emit('start', 'Socket started');

	// register Browser
	socket.on('browser', function() {
		console.log("socket browser");
		botManager.registerBrowser(socket);
		botManager.getJSONBotList((err, tjbotList) => {
			if (err) {
				handleError(err);
			} else {
				console.log("Emit botlist ");
				socket.emit('botlist', tjbotList);
			}
		});
	});

	// Whenever a new client connects send the browser an updated list
	socket.on('checkin', function(data) {
		console.log("socket checkin");
		let config = botManager.addBotToList(data, socket, handleError);
		console.log("checkin config: " + JSON.stringify(config));
		socket.emit('init_config', JSON.stringify(serviceManager.getConfigCredentials(config))); // sends a list of all available configs to the client
	});

	// TODO: merge save, event and config
	socket.on('save', function(data) {
		console.log("socket save");
		let param = JSON.parse(data);
		console.log("Save " + param.serial);
		botManager.updateField(param, handleError);
	});

	// TODO: save bulb color when set
	socket.on('event', function(data) {
		console.log("socket event");
		let param = JSON.parse(data);
		console.log("event: " + param.serial + " " + param.event.target);

		switch (param.event.target) {
			case 'microphone':
				botManager.updateObserver(param.serial, socket.id, param.event.action);
				break;
			case 'service':
				botManager.addService(param.serial, param.event.action);
				break;
		}

		console.log("observer set");
		let botSocket = botManager.getSocket(param.serial);
		if (botSocket) {
			console.log("event " + botSocket.id);
			botSocket.emit('event', JSON.stringify(param.event));
		} else {
			console.log(param.serial + " not online");
			// TODO: error handling serial not found
		}
	});

	socket.on('disconnect', function () {
		console.log("Socket disconnected.");
		botManager.disconnectSocket(socket.id, handleError);
	});

	socket.on('config', function(data) {
		console.log("socket config");
		let param = JSON.parse(data);
		console.log("config: " + data);
		botManager.updateConfig(JSON.parse(data), handleError)
		param.event.config = serviceManager.getConfigCredentials(param.event.config);
		console.log("call event on bot: " + JSON.stringify(param));
		let botSocket = botManager.getSocket(param.serial);
		if (botSocket != null) {
			botSocket.emit('event', JSON.stringify(param.event));
		}
	});

	socket.on('listen', function(data) {
		console.log("socket listen");
		for (let observer of botManager.getObserverList(socket.id)) {
			botManager.getBrowserSocket(observer).emit('listen', data)
		}
	});

	socket.on('output', function(data) {
		console.log("socket output");
		for (let observer of botManager.getObserverList(socket.id)) {
			botManager.getBrowserSocket(observer).emit('output', data)
		}
	});
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Auslagern
app.get('/botImageList', (req, res) => res.json(botManager.getBotImageList()));
app.get('/serviceOptionList', (req, res) => serviceManager.getOptionList(
		(err, optionList) => {
			if (err) {
				handleError(err);
				res.json([]);
			} else {
				res.json(optionList);
			}
		}));

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

function handleError(err) {
	console.log("Error: " + err.message);
}

/*----------------------------------------------------------------------------*/
/* EXPORTS                                                                    */
/*----------------------------------------------------------------------------*/

module.exports = {app: app, server: server};
