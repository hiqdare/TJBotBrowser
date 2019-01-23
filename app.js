const fs = require('fs');
const botImageFolder = './public/images/bots/';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var cfenv = require("cfenv");

var server = require('http').Server(app);
var io = require('socket.io')(server);

class TJBotDB {
	constructor(vcaplocal) {
			const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
			const appEnv = cfenv.getAppEnv(appEnvOpts);

			// Load the Cloudant library.
			var Cloudant = require('@cloudant/cloudant');
			if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/cloudant/)) {

			// Initialize database with credentials
			if (appEnv.services['cloudantNoSQLDB']) {
					// CF service named 'cloudantNoSQLDB'
					this.cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
			} else {
					// user-provided service with 'cloudant' in its name
					this.cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
			}
			} else if (process.env.CLOUDANT_URL){
					this.cloudant = Cloudant(process.env.CLOUDANT_URL);
			}
			if(this.cloudant) {
			//database name
			var dbName = 'tjbotdb';

			// Create a new "mydb" database.
			this.cloudant.db.create(dbName, function(err, data) {
					if(!err) //err if database doesn't already exists
					console.log("Created database: " + dbName);
			});

			// Specify the database we are going to use (mydb)...
			this.mydb = this.cloudant.db.use(dbName);

			if(!this.mydb) {
				console.log("No DB connection");
			}
		}
	}

	addBotToDB(tjbot) {
		if(!this.mydb) {
			console.log("No database.");
		}
		// insert the username as a document
		this.mydb.insert(tjbot, function(err, body, header) {
			if (err) {
				console.log('[mydb.insert] ', err.message);
				return;
			} else {
				var result = JSON.stringify(body);
				if (body.ok) {
					tjbot._id = body.id;
					tjbot._rev = body.rev;
				}
				console.log('body: ' + result);
			}
		});
	}

	getBotList() {
		var list = {};
		this.mydb.list({ include_docs: true }, function(err, body) {
			if (!err) {
				body.rows.forEach(function(row) {
					if(row.doc)
						row.doc.web.status = "offline";
						list[row.doc.data.cpuinfo.Serial] = row.doc;
				});
			}
		});
		return list;
	}
}

class BotManager {
	constructor(vcaplocal) {
		this.tjDB = new TJBotDB(vcapLocal);
		this.tjbotList = this.tjDB.getBotList();
		this.browserList = {};
		this.serialList = {};
		this.socketList = {};
	}

	addBotToList(data, socket) {
		var today = new Date();
		var dd = "0" + today.getDate();
		dd = dd.substr(dd.length - 2, 2);
		var mm = "0" + (today.getMonth() + 1);
		mm = mm.substr(mm.length - 2, 2);
		var yyyy = today.getFullYear();
		var hour = "0" + today.getHours();
		hour = hour.substr(hour.length - 2, 2);
		var min = "0" + today.getMinutes();
		min = min.substr(min.length - 2, 2);

		var tjData = JSON.parse(data);
		var serial = tjData.cpuinfo.Serial;
		this.serialList[socket.id] = serial;
		this.socketList[serial] = socket;
		if (!(serial in this.tjbotList)) {
			this.tjbotList[serial] = {};
			this.tjbotList[serial].basic = {};
			this.tjbotList[serial].basic.name = 'undefined';
			this.tjbotList[serial].basic.mentor = 'none';
			this.tjbotList[serial].basic.location = 'none';
			this.tjbotList[serial].basic.chocolate = 'none';
			this.tjbotList[serial].basic.image = 'generic.jpeg';
		} 
		this.tjbotList[serial].data = tjData;
		this.tjbotList[serial].web = {};
		//this.tjbotList[serial].web.socket_id = socket_id;
		this.tjbotList[serial].web.status = 'online';
		this.tjbotList[serial].web.lastlogin = yyyy + mm + dd + hour + min;
		this.tjDB.addBotToDB(this.tjbotList[serial]);
		this.notifyBrowser();
	}

	getSocket(serial) {
		return this.socketList[serial];
	}

	updateField(param) {
		this.tjbotList[param.serial].basic[param.field] = param.value;
		this.tjDB.addBotToDB(this.tjbotList[param.serial]);
		this.notifyBrowser();
	}

	getJSONBotList() {
		var localTJbotlist = this.tjbotList;
		return JSON.stringify(Object.keys(localTJbotlist).map(function(key) {
			var blist = {};
			blist.data = localTJbotlist[key].data;
			blist.web = localTJbotlist[key].web;
			blist.basic = localTJbotlist[key].basic;
			return blist;
		}));
	}

	registerBrowser(socket) {
		this.browserList[socket.id] = socket;
	}

	disconnectSocket(socket_id) {
		if (socket_id in this.serialList) {
			serial = this.serialList[socket_id];
			this.tjbotList[serial].web.status = 'offline';
			this.tjDB.addBotToDB(this.tjbotList[serial]);
			delete this.serialList[socket_id];
			this.notifyBrowser();
		} else if (socket_id in this.browserList) {
			delete this.browserList[socket_id];
		} else {
			console.log(socket_id + " not found");
		}
	}

	notifyBrowser() {
		var list = this.getJSONBotList();
		var localList = this.browserList;
		Object.keys(localList).forEach(function(key) {
			localList[key].emit('botlist', list);
		});
	}

	getBotImageList() {
		var botImageList = [];

		fs.readdirSync(botImageFolder).forEach(file => {
			botImageList.push(file);
		});
		return JSON.stringify(botImageList);
	}
}

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

// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

var botManager = new BotManager(vcapLocal);

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
	});


	socket.on('disconnect', function () {
		console.log("Socket disconnected.");
		botManager.disconnectSocket(socket.id);
	});

	socket.on('update', function (data) {
		param = JSON.parse(data);
		console.log("update: " + param.serial);
		browserSocket = botManager.getSocket(param.serial).emit('update', param.target);
	});

	socket.on('save', function(data) {
		param = JSON.parse(data);
		console.log("Save " + param.serial);
		botManager.updateField(param);
	})
 
});

app.get('/botImageList', (req, res) => res.json(botManager.getBotImageList()));


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

