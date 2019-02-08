/**
 *	tjbot.js
 */

$(function(){

/*----------------------------------------------------------------------------*/
/* DECLARATIONS & INITIALIZATION                                              */
/*----------------------------------------------------------------------------*/
	var i = 0;
	var ENTERKEY = 13;
	var TABKEY = 9;

	var socket = io('//' + document.location.hostname + ':' + document.location.port);

	var options = {
		singleToggle: false,  // true if `ds-single-toggle` class is used
		expandAll: false,     // true if `ds-expand-all` class is used
	}

/*----------------------------------------------------------------------------*/
/* PRIVATE FUNCTIONS			                                              */
/*----------------------------------------------------------------------------*/

	function updateBotList(botlist) {
		$("#rowbot").children(".card").remove();
		console.log("new bot list: " + botlist.length);
		$("#botcount").text("TJBots online: " + botlist.length);
		if (botlist.length > 0) {
			$.getJSON('/botImageList', function(imageResult){
				$.getJSON('/serviceOptionList', function(serviceResult){
					imageResult = JSON.parse(imageResult);
					serviceResult = JSON.parse(serviceResult);
					for (var i = 0; i < botlist.length; i++) {
						addBotToList(botlist[i], imageResult, serviceResult);
					}
				});
			});
		}
  };

  function emitEvent(serial, event) {
    socket.emit('event', '{"serial":"' + serial + '", "event": ' + event + '}');
  }


	function addBotToList(bot, botImageList, serviceList) {
		var clone = $('#bot').clone(true); // "deep" clone
		var serial = bot.data.cpuinfo.Serial;
		clone.removeAttr('id');
		clone.removeClass('ds-hide');
		clone.addClass("card");

		$('#bot').parent().append(clone);
		clone.find(".source_update").click(function(){
			socket.emit('event', '{"serial":"' + serial + '", "event": {"target": "source"}}');
		});
		clone.find(".nodejs_update").click(function(){
			socket.emit('event', '{"serial":"' + serial + '", "event": {"target": "nodejs"}}');
		});
		clone.find(".npm_update").click(function(){
			window.alert('updating npm');
			socket.emit('event', '{"serial":"' + serial + '", ""event": {target": "npm"}}');
		});

    let tjImage = clone.find(".tjbot");
    let bot_led = clone.find(".bot-led");
    let bot_arm = clone.find(".bot-arm");
		tjImage.attr("src", "images/bots/" + bot.basic.image);
		tjImage.attr("alt", "images/bots/" + bot.basic.image);

		tjImage.click(function() {
			//populateBotDetail(bot);
		});

		let status = clone.find(".status");
		let dropdownElement = clone.find(".voiceList").parent();
		status.removeClass("ds-text-neutral-8 ds-text-neutral-4");
		if (bot.web.status == "online") {
			status.addClass("ds-text-neutral-8");
			bot_led.addClass("ds-text-neutral-8");
			bot_arm.addClass("ds-text-neutral-8");
			bot_led.click(emitEvent(serial, '{"target": "led", "event":"on"}'));
			bot_arm.click(emitEvent(serial,'{"target": "arm", "event":"wave"}'));
		} else {
			status.addClass("ds-text-neutral-4");
			bot_led.addClass("ds-text-neutral-4");
			bot_arm.addClass("ds-text-neutral-4");
			dropdownElement.addClass("ds-disabled");
			bot_led.click(false);
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
		clone.find(".firmware").text(" " + bot.data.firmware + " ");

		for (let service in serviceList) {
			switch (service) {
				case 'text_to_speech':
				setServiceOptions(clone, serial, service, ".voiceList", bot.config.text_to_speech, serviceList.text_to_speech.voiceList);
				break;
			}
		}

		let accordionList = clone.find(".ds-accordion-container"); // gets list of all accordion elements
		let dropdownList = clone.find(".ds-dropdown"); // gets list of all dropdown elements

		for (let i = 0; i < accordionList.length; i++) {
			accordion = w3ds.accordion(accordionList[i]);
		}

		for (let i = 0; i < dropdownList.length; i++) {
			dropMenu = w3ds.dropdown(dropdownList[i]);
		}
	}


	function setEditableField (field, value, serial) {
		field.val(value);
		field.keypress(function (e) {
			if (e.which == ENTERKEY || e.keyCode == TABKEY) {
				socket.emit('save', '{"serial":"' + serial + '", "field": "' + field.attr("name") + '", "value": "' + field.val() + '"}');
			}
		});
	}


	function setBotImagelist(clone, serial, botImageList) {
		botImageDrop = clone.find(".botImageList");
		botImageDrop.children().remove();
		for(var i=0; i< botImageList.length; i++) {
			option = jQuery('<div class="ds-option" role="menuitem">' + botImageList[i] + '</div>');
			option.click(botImageList[i], function(event){
				socket.emit('save', '{"serial":"' + serial + '", "field": "image", "value": "' + event.data + '"}');
			})
			botImageDrop.append(option);
		}
	}


	function setServiceOptions(clone, serial, service, dropClass, savedOption, serviceOptionList) {
		if (!clone || !serial || !dropClass || !serviceOptionList) {
			console.log('tmp');
		}

		let drop = clone.find(dropClass); // find the specific dropdown
		drop.children().remove();

		for(var i=0; i< serviceOptionList.length; i++) {

			option = jQuery('<div class="ds-option" role="menuitem">' + serviceOptionList[i] + '</div>'); // create an option

			if (serviceOptionList[i] == savedOption) {
				drop.parent().find('.ds-title').text(savedOption);
				option.addClass('option-disabled');
			}

			drop.append(option);

			option.click(serviceOptionList[i], function(event) {
				option = $(event.target); // get the clicked option
				isDropdownOptionDisabled = option.hasClass('option-disabled');

				if (!isDropdownOptionDisabled) {
					dropdownElement = drop.parent();
					dropTitle = dropdownElement.find('.ds-title');
					dropTitle.text(option.text()); // change the title with input from the selected option.

					disabledDropdownOptionsList = drop.find('.option-disabled') // get a list from all disabled options

          if (disabledDropdownOptionsList.length > 0) {
            for (let a = 0; a < disabledDropdownOptionsList.length; a++) {
              $(disabledDropdownOptionsList[a]).removeClass('option-disabled'); // remove class for all disabled options
            }
          }
					option.addClass('option-disabled'); // disables the selected
					socket.emit('config', '{"serial":"' + serial + '", "event": {"target":"' + service + '", "config": {"field":"' + service + '", "value":"' + option.text() + '"}}}') // sends the selected option to the back-end
				}
			});
		}
	}


	function populateBotDetail(bot) {

		$(".detailinfo").show("scale");
		$(".info_image").attr("src", "images/" + bot.basic.image);
		$(".info_image").attr("alt", "images/" + bot.basic.image);

		table = $(".bot-table")[0];
		var tree = {
			'core' : {
				'themes':{
					'icons':false
				},
				'data' : []
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
	}*/
	tree.core.data = getTree(bot);

	$('#detail_tree').jstree(tree);
}


	function getTree(part) {
		var result = [];
		if (Array.isArray(part)) {
			var elemTree;
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
				var node = {};
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
	}

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

	socket.on('refresh', function(data) {
		updateBotList(JSON.parse(data));
	});

});
