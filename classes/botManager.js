/**
 *	botManager.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
const fs = require('fs');
const botImageFolder = './public/images/bots/';

const TJBotDB = require('./tjbotDB.js');

/*----------------------------------------------------------------------------*/
/* BotManager					                                              */
/*----------------------------------------------------------------------------*/

class BotManager {
	/**
	 * BotManager
	 *
	 * @constructor
	 * @param {object} cloudantNoSQLDB object with service information
	 */
	constructor(cloudantNoSQLDB) {
		this.browserList = {};
		this.serialList = {};
		this.socketList = {};
		this.socketObserver = {};
		this.observedSocket = {};

		this.tjDB = new TJBotDB(cloudantNoSQLDB);
		this.tjbotList = {};
	}

	/**
	 * initiate BotManager DB connection and TJBotlist
 	 * @param {function} callback function(err)
	 */
	init(callback) {
		this.tjDB.connect(this, function(err){
			if (err) {
				callback(err);
			}
		});
	}

	/**
	 * add the checked in bot to the bot list
	 * @param {object} data information and configuration from bot
	 * @param {object} socket
 	 * @param {function} callback function(err)
	 */
	addBotToList(data, socket, callback) {
		let today = new Date();
		let dd = "0" + today.getDate();
		dd = dd.substr(dd.length - 2, 2);
		let mm = "0" + (today.getMonth() + 1);
		mm = mm.substr(mm.length - 2, 2);
		let yyyy = today.getFullYear();
		let hour = "0" + today.getHours();
		hour = hour.substr(hour.length - 2, 2);
		let min = "0" + today.getMinutes();
		min = min.substr(min.length - 2, 2);

		let tjData = JSON.parse(data);
		let serial = tjData.cpuinfo.Serial;
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
			this.tjbotList[serial].config = {};
			this.tjbotList[serial].config.text_to_speech = 'none';
			this.tjbotList[serial].config.speech_to_text = 'none';
		}
		this.tjbotList[serial].data = tjData;
		this.tjbotList[serial].web = {};
		this.tjbotList[serial].web.status = 'online';
		this.tjbotList[serial].web.lastlogin = yyyy + mm + dd + hour + min;
		if (this.tjbotList[serial].config.test) {
			delete this.tjbotList[serial].config.test;
		}
		this.tjDB.addBotToDB(this.tjbotList[serial], function(err){
			callback(err);
		});
		this.notifyBrowser(this.tjbotList[serial]);
		return this.tjbotList[serial].config;
	}

	/**
	 * returns specific socket
	 * @param {string} serial
	 */
	getSocket(serial) {
		return this.socketList[serial];
	}

	/**
	 * returns specific socket
	 * @param {string} socket_id
	 */
	getBrowserSocket(socket_id) {
		return this.browserList[socket_id];
	}

	/**
	 * updates the specific field in the DB
	 * @param {object} param object with specific information about the bot and his datafield
 	 * @param {function} callback function(err)
	 */
	updateField(param, callback) {
		this.tjbotList[param.serial].basic[param.field] = param.value;
		this.tjDB.addBotToDB(this.tjbotList[param.serial], function(err){
			callback(err);
		});
		this.notifyBrowser(this.tjbotList[param.serial]);
	}

	/**
	 * updates the configuration in the DB
	 * @param {object} param object with specific information about the bot and his configuration
 	 * @param {function} callback function(err)
	 */
	updateConfig(param, callback) {
		if (typeof(param) !== "object") {
			throw new Error("missing param");
		}
		for (let service of Object.keys(param.event.config)) {
			this.tjbotList[param.serial].config[service] = param.event.config[service];
		}
		this.tjDB.addBotToDB(this.tjbotList[param.serial], function(err){
			callback(err);
		});
		this.notifyBrowser(this.tjbotList[param.serial]);
	}

	/**
	 * updates the configuration in the DB
	 * @param {string} serial tjbot serial number
 	 * @param {string} event on or off
	 */
	updateObserver(serial, socket_id, event) {
		if (event == "on") {
			/*if (!this.tjbotList[serial].web.microphone) {
				this.tjbotList[serial].web.microphone = "on";
				this.notifyBrowser(this.tjbotList[serial]);
			}*/
			if (serial in this.observedSocket) {
				// add socket_id to serial observerList
				this.observedSocket[serial].push(socket_id);
			} else {
				// create new observerList for serial
				this.observedSocket[serial] = [socket_id];
			}
			if (socket_id in this.socketObserver) {
				// add serial to list of observed serials
				this.socketObserver[socket_id].push(serial);
			} else {
				// create new list of observered serials
				this.socketObserver[socket_id] = [serial];
			}
		} else {
			// check socket_id has list
			if (socket_id in this.socketObserver) {
				if (this.socketObserver[socket_id].length == 1) {
					delete this.socketObserver[socket_id];
				} else {
					for (let i = 0; i < this.socketObserver[socket_id]; i ++) {
						if (this.socketObserver[socket_id][i] == serial) {
							this.socketObserver[socket_id].splice(i, 1);
						}
					}
				}
			}
			if (serial in this.observedSocket) {
				if (this.observedSocket[serial].length == 1) {
					delete this.observedSocket[serial];
					if (this.tjbotList[serial].web.microphone) {
						delete this.tjbotList[serial].web.microphone;
						this.notifyBrowser(this.tjbotList[serial]);
					}
				} else {
					for (let i = 0; i < this.observedSocket[serial]; i ++) {
						if (this.observedSocket[serial][i] == socket_id) {
							this.observedSocket[serial].splice(i, 1);
						}
					}
				}
			}
		}
	}

	/**
	 * updates the configuration in the DB
	 * @param {string} socket_id
	 */
	getObserverList(socket_id) {
		if (socket_id in this.serialList && this.serialList[socket_id] in this.observedSocket) {
			return this.observedSocket[this.serialList[socket_id]];
		} else {
			return [];
		}
	}

	/**
	 * return a list of bots in JSON format
	 * @param {function} callback
	 */
	getJSONBotList(callback) {
		let localTJbotlist = this.tjbotList;
		callback(null, JSON.stringify(Object.keys(localTJbotlist).map(function(key) {
			let blist = {};
			blist.data = localTJbotlist[key].data;
			blist.web = localTJbotlist[key].web;
			blist.basic = localTJbotlist[key].basic;
			blist.config = localTJbotlist[key].config;
			return blist;
		})));
	}

	/**
	 * return a list of bots in JSON format
	 * @param {object} tjbotList list of tjbots from DB
	 */
	setTJBotList(tjbotList){
		this.tjbotList = tjbotList;
	}

	/**
	 * register the browser
	 * @param {object} socket
	 */
	registerBrowser(socket) {
		this.browserList[socket.id] = socket;
	}

	/**
	 * remove socket from socket list when bot disconnects
	 * @param {string} socket_id
	 * @param {function} callback
	 */
	disconnectSocket(socket_id, callback) {
		if (socket_id in this.serialList) {
			let serial = this.serialList[socket_id];
			this.tjbotList[serial].web.status = 'offline';
			this.tjDB.addBotToDB(this.tjbotList[serial], function(err){
				callback(err);
			});
			delete this.serialList[socket_id];
			this.notifyBrowser(this.tjbotList[serial]);
		} else if (socket_id in this.browserList) { 
			delete this.browserList[socket_id];
			// TODO: remove socket_id from observerlist
		} else {
			console.log(socket_id + " not found");
		}
	}

	/**
	 * refresh every registered browser
	 */
	notifyBrowser(tjbot) {
		let tjbotCopy = {};

		tjbotCopy.data = tjbot.data;
		tjbotCopy.web = tjbot.web;
		tjbotCopy.basic = tjbot.basic;
		tjbotCopy.config = tjbot.config;
		for (let browser of Object.values(this.browserList)) {
			browser.emit('updateBot', JSON.stringify(tjbotCopy));
		}
	}

	/**
	 * returns a list of images
	 */
	getBotImageList() {
		let botImageList = [];

		fs.readdirSync(botImageFolder).forEach(file => {
			botImageList.push(file);
		});
		return JSON.stringify(botImageList);
	}
}


/*----------------------------------------------------------------------------*/
/* EXPORTS                                                                    */
/*----------------------------------------------------------------------------*/

module.exports = BotManager;
