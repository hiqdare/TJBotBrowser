/**
 *	tjbotTTS.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
let TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

/*----------------------------------------------------------------------------*/
/* DECLARATIONS & INITIALIZATION                                              */
/*----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------*/
/* PRIVATE FUNCTIONS			                                              */
/*----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------*/
/* TJBotTTS						                                              */
/*----------------------------------------------------------------------------*/

class TJBotTTS {
	constructor(vcapServices) {
		// Load the speech to text module

		let voiceList = [];

		this.textToSpeech = new TextToSpeechV1({
			iam_apikey: (vcapServices.services.text_to_speech[0].credentials.apikey),
			url: (vcapServices.services.text_to_speech[0].credentials.url),
	  	});
	}
	getVoices() {
		let voiceList = [];

		this.textToSpeech.listVoices(null,
			function(error, voicesObj) {
					if (error) {
						console.log(error);
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

module.exports = TJBotTTS;
