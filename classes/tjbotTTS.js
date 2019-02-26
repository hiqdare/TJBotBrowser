/**
 *	tjbotTTS.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

/*----------------------------------------------------------------------------*/
/* TJBotTTS						                                              */
/*----------------------------------------------------------------------------*/

/**
 * TJBotTTS
 *
 * @constructor
 * @param {object} vcapServices object with service information
 */
class TJBotTTS {
	constructor(vcapServices) {

		if (typeof(vcapServices) !== "object") {
			throw new Error("VCAP service must be type of 'object'");
		}

		// set up Text to Speech service
		this.textToSpeech = new TextToSpeechV1({
			iam_apikey: (vcapServices.text_to_speech[0].credentials.apikey),
			url: (vcapServices.text_to_speech[0].credentials.url),
	  	});
	}


/**
 * returns a list of all available voices.
 */

	getVoices() {
		let voiceList = [];

		this.textToSpeech.listVoices(null,
			function(err, voicesObj) {
					if (err) {
						//throw err;
					}
					else {
						voicesObj.voices.forEach(function(voice) {
							voiceList.push(voice.name);
						});
					}
			}
		);
		return voiceList;
	}
}

/*----------------------------------------------------------------------------*/
/* EXPORTS						                                              */
/*----------------------------------------------------------------------------*/

module.exports = TJBotTTS;
