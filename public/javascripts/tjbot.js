/**
 *	tjbot.js
 */

$(function(){

/*----------------------------------------------------------------------------*/
/* DECLARATIONS & INITIALIZATION                                              */
/*----------------------------------------------------------------------------*/
	let micOn = {};
	const ENTERKEY = 13;
	const TABKEY = 9;

	const socket = io('//' + document.location.hostname + ':' + document.location.port);

	let options = {
		singleToggle: false,  // true if `ds-single-toggle` class is used
		expandAll: false,     // true if `ds-expand-all` class is used
	}

/*----------------------------------------------------------------------------*/
/* PRIVATE FUNCTIONS			                                              */
/*----------------------------------------------------------------------------*/

	/**
	 * Creates a message for user or bot
	 * @param {string} text input text
	 * @param {string} text input class
	 */
	function createMessage(text, inputClass) {
		let clone = $('.active-overlay').find('#' + inputClass).clone(true);
		clone.removeAttr('id');
		clone.find('.text').text(text);
		clone.removeClass('ds-hide');
		clone.addClass('message');
		$('.active-overlay').find('#' + inputClass).parent().append(clone);
	};

	/**
	 * Updates bot enteries
	 * @param {object} botlist array with bot objects
	 */
	function updateBotList(botlist) {
		$("#rowbot").children(".card").remove();
		console.log("new bot list: " + botlist.length);
		//$("#botcount").text("TJBots online: " + botlist.length); // fix, not displaying anywhere
		if (botlist.length > 0) {
			$.getJSON('/botImageList', function(imageResult){
				$.getJSON('/serviceOptionList', function(serviceResult){
					imageResult = JSON.parse(imageResult);
					serviceResult = JSON.parse(serviceResult);
					for (let bot of botlist) {
						addBotToList(bot, imageResult, serviceResult);
					}
				});
			});
		}
	};

	/**
	 * Logs event and emits with type 'event'
	 * @param {object} param parameters of the event
	 */
	function emitEvent(param) {
		console.log("Emit event: ", param.data);
		socket.emit('event', param.data);
	}

  /**
   * creates for every bot entry a clone with his own information and configuration
   * @param {object} bot object with information and configuration about the bot
   * @param {object} botImageList array with images
   * @param {object} serviceList object with service information and options
   */
	function addBotToList(bot, botImageList, serviceList) {
		let clone = $('#bot').clone(true); // "deep" clone
		let serial = bot.data.cpuinfo.Serial;
		clone.attr('id', "bot_" + serial);
		clone.removeClass('ds-hide');
		clone.addClass("card");

		$('#bot').parent().append(clone);
		let source_update = clone.find(".source_update");
		let nodejs_update = clone.find(".nodejs_update");
		let npm_update = clone.find(".npm_update");
		let nodemon_update = clone.find(".nodemon_update");
		let tjImage = clone.find(".tjbot");
		let bot_led = clone.find(".bot-led");
		let bot_arm = clone.find(".bot-arm");
		let microphone = clone.find(".microphone");
		let canvas = clone.find('.picker');
		let status = clone.find(".status");
		let sttDropdown = clone.find(".speech_to_text").parent();
		let ttsDropdown = clone.find(".text_to_speech").parent();
		let assistantDropdown = clone.find(".assistant").parent();
		let overlay = clone.find(".overlay");
		let chathistory = clone.find(".chathistory");
		let param = {};


		tjImage.attr("src", "images/bots/" + bot.basic.image);
		tjImage.attr("alt", "images/bots/" + bot.basic.image);
		// create canvas and context objects
		canvas.attr("id", "picker-" + serial);
    	let ctx = canvas[0].getContext('2d');

    	// drawing active image
    	let image = new Image();
    	image.onload = function () {
      		ctx.drawImage(image, 0, 0, 200, 200); // draw the image on the canvas
    	}

		image.src = "images/colorwheel.png";

		canvas.click(function(e) { // mouse move handler
			// get coordinates of current position
			let canvasOffset = $(canvas).offset();
			let canvasX = Math.floor(e.pageX - canvasOffset.left);
			let canvasY = Math.floor(e.pageY - canvasOffset.top);

			// get current pixel
			let imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
			let pixel = imageData.data;

			// update preview color
			let pixelColor = "rgb("+pixel[0]+", "+pixel[1]+", "+pixel[2]+")";
			let pixel0 = '0' + pixel[0].toString(16);
			let pixel1 = '0' + pixel[1].toString(16);
			let pixel2 = '0' + pixel[2].toString(16);
			pixel0 = pixel0.substr(pixel0.length - 2, 2);
			pixel1 = pixel1.substr(pixel1.length - 2, 2);
			pixel2 = pixel2.substr(pixel2.length - 2, 2);
			param.data = '{"serial":"' + serial + '", "event": {"target": "led", "action":"' + pixel0 + pixel1 + pixel2 + '"}}';
			bot_led.css('backgroundColor', pixelColor);
			emitEvent(param);
		});

		status.removeClass("ds-text-neutral-8 ds-text-neutral-4");
		if (bot.web.status == "online") {
			// set color
			source_update.addClass("ds-text-neutral-8");
			nodejs_update.addClass("ds-text-neutral-8");
			npm_update.addClass("ds-text-neutral-8");
			nodemon_update.addClass("ds-text-neutral-8");
			status.addClass("ds-text-neutral-8");
      		bot_led.addClass("ds-text-neutral-8");
			bot_arm.addClass("ds-text-neutral-8");
			microphone.addClass("ds-text-neutral-8");
			assistantDropdown.removeClass("ds-disabled");
			canvas.css("display", "block");

			// set action
			source_update.click('{"serial":"' + serial + '", "event": {"target": "source"}}', emitEvent);
			nodejs_update.click('{"serial":"' + serial + '", "event": {"target": "nodejs"}}', emitEvent);
			npm_update.click('{"serial":"' + serial + '", "event": {"target": "npm"}}', emitEvent);
			nodemon_update.click('{"serial":"' + serial + '", "event": {"target": "nodemon"}}', emitEvent);
			bot_arm.click('{"serial": "' + serial + '","event": {"target": "arm", "action":"wave"}}', emitEvent);
			micOn[serial] = (bot.web.microphone != null);
			microphone.click(function(event) {
				if (!micOn[serial]) {
					micOn[serial] = true;
					param.data = '{"serial":"' + serial + '", "event": {"target": "microphone", "action":"on"}}';
					overlay.removeClass('ds-hide');
					overlay.addClass('active-overlay');

					overlay.find('.ds-icon-trash').click(function(e) {
						console.log("klick")
						chathistory.children('.message').remove()
					});
					overlay.find('.ds-icon-close').click(function(e) {
						overlay.addClass('ds-hide');
						micOn[serial] = false;
						param.data = '{"serial":"' + serial + '", "event": {"target": "microphone", "action":"off"}}';
						emitEvent(param);
					});
				}
				emitEvent(param);
			});
		} else {
			// set color
			source_update.addClass("ds-text-neutral-4");
			nodejs_update.addClass("ds-text-neutral-4");
			npm_update.addClass("ds-text-neutral-4");
			nodemon_update.addClass("ds-text-neutral-4");
			status.addClass("ds-text-neutral-4");
			bot_led.addClass("ds-text-neutral-4");
			bot_arm.addClass("ds-text-neutral-4");
			microphone.addClass("ds-text-neutral-4");
			sttDropdown.addClass("ds-disabled");
			sttDropdown.attr("data-toggle", "tooltip");
			sttDropdown.attr("title", "service not available");
			ttsDropdown.addClass("ds-disabled");
			ttsDropdown.attr("data-toggle", "tooltip");
			ttsDropdown.attr("title", "service not available");
			assistantDropdown.addClass("ds-disabled");
			assistantDropdown.attr("data-toggle", "tooltip");
			assistantDropdown.attr("title", "service not available");
			canvas.css("display", "none");

			// set action
			source_update.click(false);
			nodejs_update.click(false);
			npm_update.click(false);
			nodemon_update.click(false);
			bot_arm.click(false);
		}

		setEditableField(clone.find(".input-name"), bot.basic.name, serial);
		setEditableField(clone.find(".input-chocolate"), bot.basic.chocolate, serial);
		setEditableField(clone.find(".input-mentor"), bot.basic.mentor, serial);
		setEditableField(clone.find(".input-location"), bot.basic.location, serial);
		setBotImagelist(clone, serial, botImageList);

		clone.find(".source_version").text(" " + bot.data.npm_version.tjbotclient + " ");
		clone.find(".nodejs_version").text(" " + bot.data.nodejs_version + " ");
		clone.find(".npm_version").text(" " + bot.data.npm_version.npm + " ");
		clone.find(".os_release").text(" " + bot.data.os_release + " ");
		if (bot.data.firmware) {
			clone.find(".firmware").text(" " + bot.data.firmware[0] + " ");
		}
		if (bot.data.npm_package && bot.data.npm_package.nodemon) {
			clone.find(".nodemon_version").text(" " + bot.data.npm_package.nodemon + " "); // TO DO version not showing
		}

		clone.find(".tjbot-name").text(bot.basic.name); // set TJBot name in overlay

		fillAccordion(clone.find(".version_info"), bot.data.npm_version);
		fillAccordion(clone.find(".pkg_info"), bot.data.npm_package);
		fillAccordion(clone.find(".cpu_info"), bot.data.cpuinfo);

		for (let type of Object.keys(serviceList)) {
			for (let name of Object.keys(serviceList[type])) {
				setServiceOptions(serial, type, name, clone.find("." + type), bot.config[type], serviceList[type][name].options);
				//setServiceOptions(serial, type, name, clone.find("." + type), bot.config[type], []); // only for testing
				break;
			}
		}

		for (let accordionItem of clone.find(".ds-accordion-container")) {
			accordion = w3ds.accordion(accordionItem);
		}

		for (let dropDownItem of clone.find(".ds-dropdown")) {
			dropMenu = w3ds.dropdown(dropDownItem);
		}

		for (let trayItem of clone.find(".ds-tray")) {
			tray = w3ds.tray(trayItem);
		}
	}

	/**
     * sets the value for the field
	 * sends the new value to the backend
     * @param {object} field field element
     * @param {string} value field value
     * @param {serial} serial
     */
	function setEditableField (field, value, serial) {
		field.val(value);
		field.keypress(function (e) {
			if (e.which == ENTERKEY || e.keyCode == TABKEY) {
				socket.emit('save', '{"serial":"' + serial + '", "field": "' + field.attr("name") + '", "value": "' + field.val() + '"}');
			}
		});
	}

	/**
     * creates image options for dropdown
	 * add an evenlistener for every option
	 * sends the selected option to the backend
     * @param {object} clone bot entry element
     * @param {string} serial
     * @param {string[]} botImageList array with images names
     */
	function setBotImagelist(clone, serial, botImageList) {
		botImageDrop = clone.find(".botImageList");
		botImageDrop.children().remove();
		for(let i=0; i< botImageList.length; i++) {
			option = jQuery('<div class="ds-option" role="menuitem">' + botImageList[i] + '</div>');
			option.click(botImageList[i], function(param){
				socket.emit('save', '{"serial":"' + serial + '", "field": "image", "value": "' + param.data + '"}');
			})
			botImageDrop.append(option);
		}
	}

	/**
	 * creates service options for dropdown
     * add an evenlistener for every option
     * sends the selected option to the backend
     * @param {string} serial serial ID of the TJBot
     * @param {string} service name of the IBM Cloud service
     * @param {string} serviceName name of the service instance
	 * @param {object} dropField dropdown CSS class
	 * @param {string} savedOption last configured option
	 * @param {object} serviceOptionList list with services and options
     */
	function setServiceOptions(serial, service, serviceName, dropField, savedOption, serviceOptionList) {

		/*if (!serial || !service || !serviceName || !dropField || !savedOption || !serviceOptionList) {
			console.log('Error: tjbot.js: setServiceOptions(): Parameter missing');
		}*/

		dropField.children().remove();

		if (serviceOptionList.length == 0) {
			dropField.parent().addClass('ds-disabled');
			dropField.parent().attr("data-toggle", "tooltip");
			dropField.parent().attr("title", "No option available");

			if(service == "assistant") {
				dropField.parent().attr("data-toggle", "tooltip");
				dropField.parent().attr("title", "No workspaces available");
			}

		} else {
			//dropField.parent().removeClass('ds-disabled')

			for(let serviceOption of serviceOptionList) {

				//option = jQuery('<div class="ds-option" role="menuitem">' + serviceOption + '</div>'); // create an option
				option = jQuery('<div class="ds-option" role="menuitem">' + serviceOption.name + '(' + serviceName + ')</div>'); // create an option

				if (savedOption && serviceOption.id == savedOption.option) {
					dropField.parent().find('.ds-title').text(serviceOption.name);
					option.addClass('option-disabled');
				}

				dropField.append(option);

				option.click('{"name":"' + serviceName + '", "option":"' + serviceOption.id + '"}', function(event) {
					option = $(event.target);
					if (!option.hasClass('option-disabled')) {
						dropField.parent().find('.ds-title').text(serviceOption.name); // change the title with input from the selected option.

						disabledDropdownOptionsList = dropField.find('.option-disabled') // get a list from all disabled options

						if (disabledDropdownOptionsList.length > 0) {
							for (let disabledDropdownOption of disabledDropdownOptionsList) {
								$(disabledDropdownOption).removeClass('option-disabled'); // remove class for all disabled options
							}
						}
						option.addClass('option-disabled'); // disables the selected option
						socket.emit('config', '{"serial":"' + serial + '", "event": {"target":"service", "config": {"' + service + '":' + event.data + '}}}') // sends the selected option to the back-end
					}
				});
			}
		}
	}

	/**
	 * Updates bot enteries
	 * @param {object} elem element to be filled with data
	 * @param {object} part json object containing information for accordion
	 */
	function fillAccordion(elem, part) {
		if (Array.isArray(part)) {
			if (part.length == 1) {
				elem.text(part[0]);
			} else {
				nesting = jQuery('<div class="ds-accordion-nested ds-mar-t-0 ds-mar-b-0">');
				elem.append(nesting);
				console.log("is array");
			}
		} else if (typeof part === 'object' && part !== null) {
			table = jQuery('<table class="ds-table ds-table-compact ds-pad-b-1 ds-pad-t-1"><tbody /></table>');
			elem.append(table);
			Object.keys(part).sort().forEach(function(key) {
				item = jQuery('<tr><td>' + key + "</td><td> " + part[key] + " </td>").appendTo(table);
			});
		} else {
			elem.text(part);
		}
	}


	/*function fillTree(data, label) {
		var tree = {
			'core' : {
				'themes':{
					'icons':false
				},
				data : []
			}
		};
		/*'Simple root node',
		{
		'text' : 'Root node 2',
		'state' : {
			'opened' : false,
			'selected' : false
		},
		'children' : [
			{ 'text' : 'Child 1' },
			'Child 2'
		]
	}
	tree.core.data = getTree(data);

	return tree
}*/

// Wird das noch gebraucht?
/**
 *
 */
	/*function getTree(part) {
		let result = [];
		if (Array.isArray(part)) {
			let elemTree;
			console.log("is array");
			part.forEach(function(elem){
				elemTree = getTree(elem);
				if (elemTree.length == 1) {
					result.push(elemTree[0]);
				} else {
					result.push(elemTree);
				}

			});
			return result;
		} else if (typeof part === 'object' && part !== null) {
			console.log("is object");
			Object.keys(part).forEach(function(key) {
				let node = {};
				node.text = key;
				node.state = {};
				node.state.opened = false;
				node.state.selected = false;
				node.children = getTree(part[key]);
				result.push(node);
			});
			return result
		} else {
			console.log(part + "is primitve");
			result.push(part);
			return result;
		}
	}*/

/*----------------------------------------------------------------------------*/
/* MAIN							                                              */
/*----------------------------------------------------------------------------*/

	$(".close_detail").click(function() {
		$(".detailinfo").hide("scale");
	});

	socket.on('start', function(data) {
		console.log('start: ' + data);
		socket.emit('browser');
	});

	socket.on('botlist', function(data) {
		updateBotList(JSON.parse(data));
	});

	socket.on('listen', function(data) {
		createMessage(data, "userMessage");
		console.log("tjbot msg: " + data);
	});

	socket.on('output', function(data) {
		createMessage(data, "tjbotMessage");
		console.log("user msg: " + data);
	});

});
