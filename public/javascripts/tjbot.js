$(function(){
    var i = 0;
    var ENTERKEY = 13;
    var TABKEY = 9;

    var socket = io('//' + document.location.hostname + ':' + document.location.port);
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
  
    socket.on('listOfTTSVoices', function(voicesObj) {
	  let dropdownElements = document.getElementsByClassName('ds-dropdown'); // Full dropdown element
	  let dropdownOptions = document.getElementsByClassName('ds-options'); // Full dropdown options

		  for(let i = 0; i < dropdownOptions.length; i++) {
			  for(let a = 0; a < voicesObj.voices.length; a++) {
				let dropdownOption = document.createElement('div');
				dropdownOption.classList.add('ds-option');
				dropdownOption.setAttribute('role', 'menuitem');
				dropdownOption.innerHTML = voicesObj.voices[a].name;

				dropdownOptions[i].appendChild(dropdownOption);
				isDropdownOptionDisabled = dropdownOption.classList.contains('ds-disabled');

					dropdownOption.addEventListener('click',
						function() {
							isDropdownOptionDisabled = dropdownOption.classList.contains('ds-disabled'); // check if the dropdownOption is disabled.

							if (!isDropdownOptionDisabled) {
								let dropdownText = dropdownElements[i].getElementsByClassName('ds-title');
								dropdownText[0].innerHTML = dropdownOption.textContent;
								let disabledDropdownOptions = dropdownOptions[i].getElementsByClassName('ds-disabled');

								if (disabledDropdownOptions.length > 0) {
									for (let b = 0; b < disabledDropdownOptions.length; b++) {
										disabledDropdownOptions[b].classList.remove('ds-disabled'); // enables all options
									}
								}

								dropdownOption.classList.add('ds-disabled'); // disables the selected option
								socket.emit('ttsVoiceSelected', dropdownOption.textContent) // sends the selected voice to the back-end
							}
						}
					);
			  }
		  }
  });

    function updateBotList(botlist) {
      $("#rowbot").children(".card").remove();
      console.log("new bot list: " + botlist.length);
      $("#botcount").text("TJBots online: " + botlist.length);
      if (botlist.length > 0) {
        $.getJSON('/botImageList', function(result){
          for (var i = 0; i < botlist.length; i++) {
            addBotToList(botlist[i], JSON.parse(result));
          }
        });
      }
    }


    function addBotToList(bot, botImageList) {

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
      clone.find(".bot-led").click(function(){
        socket.emit('event', '{"serial":"' + serial + '", "event": {"target": "led", "event":"on"}}');
      });
      clone.find(".bot-arm").click(function(){
        socket.emit('event', '{"serial":"' + serial + '", "event": {"target": "arm", "event":"wave"}}');
      });
      var tjImage = clone.find(".tjbot");
      tjImage.attr("src", "images/bots/" + bot.basic.image);
      tjImage.attr("alt", "images/bots/" + bot.basic.image);

      tjImage.click(function() {
        //populateBotDetail(bot);
      });
      var status = clone.find(".status");
      status.removeClass("ds-text-neutral-8 ds-text-neutral-4");
      if (bot.web.status == "online") {
        status.addClass("ds-text-neutral-8");
      } else {
        status.addClass("ds-text-neutral-4");
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
      
      accordion = w3ds.accordion(clone.find(".ds-accordion-container")[0]);
      dropMenu = w3ds.dropdown(clone.find(".ds-dropdown")[0]);
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
        }};
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
  });

  var options = {
      singleToggle: false,  // true if `ds-single-toggle` class is used
      expandAll: false,     // true if `ds-expand-all` class is used
  }
