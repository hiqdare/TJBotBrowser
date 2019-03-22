/**
 *	serviceManager.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/

const serviceClasses = {'text_to_speech': require('watson-developer-cloud/text-to-speech/v1'),
                        'speech_to_text': require('watson-developer-cloud/speech-to-text/v1'),
                        'assistant': require('watson-developer-cloud/assistant/v1')};

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
			throw new Error("vcapServices must be type of 'object'");
        }


        if (vcapServices.conversation) {
            vcapServices.assistant = vcapServices.conversation;
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
                        url: (item.credentials.url),
                        version: "2019-02-28"
                    });
                }
            } else {
                console.log('service ' + key + ' not found');
            }
        }
    }

    getConfigCredentials(config) {
        for (let service of Object.keys(config)) {
            if (config[service]) {
                if (config[service].name in this.serviceList) {
                    config[service].url = this.serviceList[config[service].name].service._options.url;
                    config[service].iam_apikey = this.serviceList[config[service].name].service._options.iam_apikey;
                } else {
                    console.log(service + " " + config[service].name + " not in " + Object.keys(this.serviceList));
                }
            }
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
        optionList.assistant = {};
        let serviceList = this.serviceList;
        let keylist = Object.keys(serviceList);
        let calls = keylist.length;
        for (let key of Object.keys(serviceList)) {
            switch(serviceList[key].type) {
                case 'text_to_speech':
                    optionList.text_to_speech[key] = {};
                    optionList.text_to_speech[key].options = [];
                    serviceList[key].service.listVoices(null,
                        function(err, voicesObj) {
                            calls--;
                            if (err) {
                                callback(err);
                            } else {
                                for (let voice of voicesObj.voices) {
                                    optionList.text_to_speech[key].options.push({name: voice.name, id: voice.name});
                                }
                                if (calls == 0) {
                                    callback(null, JSON.stringify(optionList));
                                }
                            }
                        }
                    );
                    break;
                case 'speech_to_text':
                    optionList.speech_to_text[key] = {};
                    optionList.speech_to_text[key].options = [];
                    serviceList[key].service.listModels(null, 
                        function(err, speechModels) {
                            calls--;
                            let modelOptions;
                            if (err) {
                                callback(err);
                            } else {
                                for (let model of speechModels.models) {
                                    modelOptions = model.name.split("_");
                                    if (modelOptions.length == 2 && modelOptions[1] == "BroadbandModel") {
                                        optionList.speech_to_text[key].options.push({name: modelOptions[0], id: modelOptions[0]});
                                    }
                                }
                                if (calls == 0) {
                                    callback(null, JSON.stringify(optionList));
                                }
                            }
                        }
                    );
                    break;
                case 'assistant':
                    optionList.assistant[key] = {};
                    optionList.assistant[key].options = [];
                    serviceList[key].service.listWorkspaces(null,
                        function(err, workspacesObj) {
                            calls--;
                            //let workspaceNameList = [];
                            //let workspaceIdList = [];
                            if (err) {
                                if(err.code == 400) {
                                    callback(new Error('serviceManager.js: getOptionList(): Watson Assistant Service: Invalid Request'));
                                } else {
                                    callback(err);
                                }
                                //
                            } else {
                                for (let workspace of workspacesObj.workspaces) {
                                    optionList.assistant[key].options.push({name: workspace.name, id: workspace.workspace_id});
                                }
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