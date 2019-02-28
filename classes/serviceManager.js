/**
 *	serviceManager.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
const TJBotTTS = require('./tjbotTTS.js');
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

/*----------------------------------------------------------------------------*/
/* ServiceManager					                                              */
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

        if (vcapServices.text_to_speech != null)
            this.tjTTS = new TJBotTTS(vcapServices);
        }

        if (vcapServices.speech_to_text != null)
            this.tjSTT = new TJBotSTT(vcapServices);
        }
    }



	/**
	 * returns a list of all available service options
	 */
	getOptionList() {
		let optionList = {};
        optionList.text_to_speech = {};
        optionList.text_to_speech.voiceList = [];
        if (this.tjTTS != null) {
		    optionList.text_to_speech.voiceList = this.tjTTS.getVoices();
        } 
		return JSON.stringify(optionList);
	}
}


/*----------------------------------------------------------------------------*/
/* EXPORTS                                                                    */
/*----------------------------------------------------------------------------*/

module.exports = ServiceManager; 