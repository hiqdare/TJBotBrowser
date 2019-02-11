/**
 *	botManager.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
const fs = require('fs');
const botImageFolder = './public/images/bots/';

let TJBotDB = require('./tjbotDB.js');
let TJBotTTS = require('./tjbotTTS.js');

/*----------------------------------------------------------------------------*/
/* DECLARATIONS & INITIALIZATION                                              */
/*----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------*/
/* PRIVATE FUNCTIONS			                                              */
/*----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------*/
/* BotManager					                                              */
/*----------------------------------------------------------------------------*/

class BotManager {


	constructor(vcapServices) {
		this.tjDB = new TJBotDB(vcapServices);
		this.tjTTS = new TJBotTTS(vcapServices);
		this.voiceList = this.tjTTS.getVoices();
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

	getSocket(serial) {
		return this.socketList[serial];
	}

	updateField(param) {
		this.tjbotList[param.serial].basic[param.field] = param.value;
		this.tjDB.addBotToDB(this.tjbotList[param.serial]);
		this.notifyBrowser();
	}

	updateConfig(param) {
		this.tjbotList[param.serial].config[param.event.config.field] = param.event.config.value;
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
			blist.config = localTJbotlist[key].config;
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

	getOptionList() {
		let optionList = {};
		optionList.text_to_speech = {};
		optionList.text_to_speech.voiceList = this.voiceList;

		return JSON.stringify(optionList);
	}

	getConfigList(socket_id) {
		let serial = this.serialList[socket_id];
		let configList = {};
		configList.text_to_speech = this.tjbotList[serial].config.text_to_speech;

		return JSON.stringify(configList);
	}
}


/*----------------------------------------------------------------------------*/
/* EXPORTS                                                                    */
/*----------------------------------------------------------------------------*/

module.exports = BotManager;
