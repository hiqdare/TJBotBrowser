/**
 *	botManager.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
const fs = require('fs');
const botImageFolder = './public/images/bots/';

const TJBotDB = require('./TjbotDB.js');
const TJBotTTS = require('./TjbotTTS.js');

/*----------------------------------------------------------------------------*/
/* BotManager					                                              */
/*----------------------------------------------------------------------------*/

/**
 * BotManager
 *
 * @constructor
 * @param {object} vcapServices object with service information
 */
class BotManager {
	constructor(vcapServices) {

		if (typeof(vcapServices) !== "object") {
			throw new Error("VCAP service must be type of 'object'");
		}

		this.tjDB = new TJBotDB(vcapServices);
		this.tjTTS = new TJBotTTS(vcapServices);
		this.voiceList = this.tjTTS.getVoices();
		this.tjbotList = this.tjDB.getBotList();
		this.browserList = {};
		this.serialList = {};
		this.socketList = {};
	}

	/**
	 * add the checked in bot to the bot list
	 * @param {object} data information and configuration from bot
	 * @param {object} socket
	 */
	addBotToList(data, socket) {
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
		}
		this.tjbotList[serial].data = tjData;
		this.tjbotList[serial].web = {};
		//this.tjbotList[serial].web.socket_id = socket_id;
		this.tjbotList[serial].web.status = 'online';
		this.tjbotList[serial].web.lastlogin = yyyy + mm + dd + hour + min;
		this.tjDB.addBotToDB(this.tjbotList[serial]);
		this.notifyBrowser();
	}

	/**
	 * returns specific socket
	 * @param {object} serial
	 */
	getSocket(serial) {
		return this.socketList[serial];
	}

	/**
	 * updates the specific field in the DB
	 * @param {object} param object with specific information about the bot and his datafield
	 */
	updateField(param) {
		this.tjbotList[param.serial].basic[param.field] = param.value;
		this.tjDB.addBotToDB(this.tjbotList[param.serial]);
		this.notifyBrowser();
	}

	/**
	 * updates the configuration in the DB
	 * @param {object} param object with specific information about the bot and his configuration
	 */
	updateConfig(param) {

		if (typeof(param) !== "object") {
			throw new Error("missing param");
		}

		this.tjbotList[param.serial].config[param.event.config.field] = param.event.config.value;
		this.tjDB.addBotToDB(this.tjbotList[param.serial]);
		this.notifyBrowser();
	}

	/**
	 * return a list of bots in JSON format
	 */
	getJSONBotList() {
		let localTJbotlist = this.tjbotList;
		return JSON.stringify(Object.keys(localTJbotlist).map(function(key) {
			let blist = {};
			blist.data = localTJbotlist[key].data;
			blist.web = localTJbotlist[key].web;
			blist.basic = localTJbotlist[key].basic;
			blist.config = localTJbotlist[key].config;
			return blist;
		}));
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
	 */
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

	/**
	 * refresh every registered browser
	 */
	notifyBrowser() {
		let list = this.getJSONBotList();
		console.log('list: ', list)
		let localList = this.browserList;
		Object.keys(localList).forEach(function(key) {
			localList[key].emit('botlist', list);
		});

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

	/**
	 * returns a list of all available service options
	 */
	getOptionList() {
		let optionList = {};
		optionList.text_to_speech = {};
		optionList.text_to_speech.voiceList = this.voiceList;

		return JSON.stringify(optionList);
	}

	/**
	 * returns a list with specific bot configuration
	 * @param {string} socket_id unique ID from client his socket
	 */
	getConfigList(socket_id) {
		if (typeof(socket_id) !== "string") {
			throw new Error("missing socket_id");
		}

		let configList = {};
		let serial = this.serialList[socket_id];
		configList.text_to_speech = this.tjbotList[serial].config.text_to_speech;

		return JSON.stringify(configList);
	}
}


/*----------------------------------------------------------------------------*/
/* EXPORTS                                                                    */
/*----------------------------------------------------------------------------*/

module.exports = BotManager;
