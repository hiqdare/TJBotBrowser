/**
 *	serviceManager.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/

const serviceClasses = {'text_to_speech': require('watson-developer-cloud/text-to-speech/v1'),
                        'speech_to_text': require('watson-developer-cloud/speech-to-text/v1')};

/*----------------------------------------------------------------------------*/
/* ServiceManager					                                          */
/*----------------------------------------------------------------------------*/

/**
 * ServiceManager
 *
 * @constructor
 * @param {object} vcapServices object with service information
 */
class ServiceManager {
	constructor(vcapServices) {

        if (typeof(vcapServices) !== "object") {
			throw new Error("VCAP service must be type of 'object'");
        }

        this.serviceList = {};
        
        let keys = Object.keys(vcapServices);
        for (let key of keys) {
            if (serviceClasses.hasOwnProperty(key)) {
                for (let item of vcapServices[key]) {
                    this.serviceList[item.name] = {};
                    this.serviceList[item.name].type = key;
                    this.serviceList[item.name].service = new serviceClasses[key]({
                        iam_apikey: (item.credentials.apikey),
                        url: (item.credentials.url)
                    });
                }
            } else {
                console.log('service ' + key + ' not found');
            }
        }
    }

    getConfigCredentials(config) {
        for (let service of Object.keys(config)) {
            config[service].url = this.serviceList[config[service].name].service._options.url;
            config[service].iam_apikey = this.serviceList[config[service].name].service._options.iam_apikey;
        }
        return config;
    }



	/**
	 * returns a list of all available service options
	 */
	getOptionList(callback) {
        let optionList = {};
        optionList.speech_to_text = {};
        optionList.text_to_speech = {};
        let serviceList = this.serviceList;
        let keylist = Object.keys(serviceList);
        let calls = keylist.length;
        for (let key of Object.keys(serviceList)) {
            switch(serviceList[key].type) {
                case 'text_to_speech':
                    optionList.text_to_speech[key] = {};
                    serviceList[key].service.listVoices(null,
                        function(err, voicesObj) {
                            calls--;
                            let voiceList = [];
                            if (err) {
                                callback(err);
                            } else {
                                for (let voice of voicesObj.voices) {
                                    voiceList.push(voice.name);
                                }
                                
                                optionList.text_to_speech[key].options = voiceList;
                                if (calls == 0) {
                                    callback(null, JSON.stringify(optionList));
                                }
                            }
                        }
                    );
                    break;
                case 'speech_to_text':
                    optionList.speech_to_text[key] = {};
                    serviceList[key].service.listModels(null, 
                        function(err, speechModels) {
                            calls--;
                            let modelList = [];
                            if (err) {
                                callback(err);
                            } else {
                                for (let model of speechModels.models) {
                                    modelList.push(model.name);
                                }
                                optionList.speech_to_text[key].options = modelList;
                                if (calls == 0) {
                                    callback(null, JSON.stringify(optionList));
                                }
                            }
                        }
                    );
                    break;
                default:
                    calls--;
            }
            if (calls == 0) {
                callback(null, JSON.stringify(optionList));
            }
        }
    }
}


/*----------------------------------------------------------------------------*/
/* EXPORTS                                                                    */
/*----------------------------------------------------------------------------*/

module.exports = ServiceManager; 