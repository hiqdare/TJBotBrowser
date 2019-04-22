this.w3ds=this.w3ds||{},this.w3ds.js=function(){"use strict";function t(t,e){var s={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(s[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,n=Object.getOwnPropertySymbols(t);i<n.length;i++)e.indexOf(n[i])<0&&(s[n[i]]=t[n[i]]);return s}var e=function(t,e){return e?e.querySelector(t):document.querySelector(t)},s=function(t,e){return e?[].slice.call(e.querySelectorAll(t)):[].slice.call(document.querySelectorAll(t))},n=function(t){var e=document.createElement("div");return e.innerHTML=t.trim(),e.firstChild},i=function(t){return[].slice.call(t)},o=function(t,e,s){return t.addEventListener(e,s)},r=function(t){return-1!==i(t.classList).indexOf("ds-disabled")},a=function(t,e){return Array.isArray(e)?e.filter(function(e){return t.classList.contains(e)?e:""}):t.classList.contains(e)},l=function(t,e,s,n){var i=function(){var s={height:"scrollHeight",width:"scrollWidth"},n={height:["padding-top","padding-bottom"],width:["padding-left","padding-right"]}[e].reduce(function(e,s){return parseInt(window.getComputedStyle(t).getPropertyValue(e).replace("px",""))+parseInt(window.getComputedStyle(t).getPropertyValue(s).replace("px",""))});return t[s[e]]+n+"px"},o=function(e){t.style.transition="height 300ms ease",t.style.height=e};return function(){if(s)l(t,e,!1,!0),setTimeout(function(){o("0px")},10);else{var r=i();o(r)}setTimeout(function(){!1!==s||n||(t.style.height="auto")},200)}()},c=function(t){return 13===t.which},d=function(){function n(t){this.els={container:t,itemList:s(".ds-accordion-item",t),groupTrigger:e('.ds-expand-all-trigger[data-element="'+t.getAttribute("id")+'"]')},this.state={items:[],eventTypes:["click","keydown"],singleToggle:a(t,"ds-single-toggle"),allToggled:this.els.itemList.filter(function(t){return a(t,"ds-open")}).length===this.els.itemList.length},this.setters={toggleMap:{true:{attr:"true",tabIndex:"0",collapseText:'\n          <span>COLLAPSE ALL</span>\n          <span class="ds-heading-5 ds-icon-size-small ds-icon-caret-up-fill"></span>\n        ',toggleSlidedown:function(t){return Object.keys(t).map(function(e){return t[e].classList.add("ds-open")})}},false:{attr:"false",tabIndex:"-1",collapseText:'\n          <span>EXPAND ALL</span>\n          <span class="ds-heading-5 ds-icon-size-small ds-icon-caret-down-fill"></span>\n        ',toggleSlidedown:function(t){return Object.keys(t).map(function(e){return t[e].classList.remove("ds-open")})}}}},this.mounted()}return n.prototype.mounted=function(){var t=this;this.state.items=this.setSubItems(),this.state.items.map(function(e,s){return t.state.eventTypes.forEach(function(n){return o(e.item,n,function(i){return t.itemEventConditions(i,n,e,s)})})}),this.els.groupTrigger&&(this.els.groupTrigger.innerHTML=this.updategroupTrigger(),this.state.eventTypes.forEach(function(e){return o(t.els.groupTrigger,e,function(s){return t.groupEventConditions(s,e)})}))},n.prototype.itemEventConditions=function(t,e,n,i){if("keydown"===e&&!c(t)||t.target===n.content||-1!==s("*",n.content).indexOf(t.target))return!1;this.state.singleToggle&&this.handleInactiveItems(n,i),this.main(n,i)},n.prototype.groupEventConditions=function(t,e){var s=this;("keydown"!==e||c(t))&&(this.state.allToggled=!this.state.allToggled,this.els.groupTrigger.innerHTML=this.updategroupTrigger(),this.state.items.map(function(t,e){return s.main(t,e,s.state.allToggled,!0)}))},n.prototype.handleInactiveItems=function(t,e){var s=this;this.state.items.filter(function(e){return JSON.stringify(e)!==JSON.stringify(t)}).map(function(t){t.open=!1;var e=s.updateStyles(t,!0);return s.sideEffects(e,t)})},n.prototype.main=function(t,e,n,i){this.setAccordionState(e,n);var o=this.updateStyles(t,e);if(this.sideEffects(o,t),i){var r=s(".ds-accordion-nested > div",this.els.container);r.length>0&&this.handleNested(r,this.state.items,this.state.allToggled)}},n.prototype.handleNested=function(t,e,s){var n=this;t.map(function(t){var i=e.filter(function(e){return e.item===t})[0];return n.main(i,e.indexOf(i),s),l(t.parentNode.parentNode,"height",!i.open)})},n.prototype.setSubItems=function(){return this.els.itemList.map(function(t){return{open:a(t,"ds-open"),title:e(".ds-accordion-title",t),content:e(".ds-accordion-slidedown",t),item:t}})},n.prototype.setAccordionState=function(t,e){this.state.items[t].open=void 0!==e?e:!this.state.items[t].open},n.prototype.updateStyles=function(e,s){var n="number"==typeof s&&this.state.items[s].open,i=this.setters.toggleMap[n],o=(e.open,t(e,["open"]));return i.toggleSlidedown(o),i},n.prototype.sideEffects=function(e,s){var n=s.item,i=s.content,o=s.open;t(s,["item","content","open"]);l(i,"height",!o),i.setAttribute("aria-hidden",!e.attr),n.setAttribute("aria-expanded",e.attr),n.setAttribute("tab-index",e.tabIndex)},n.prototype.updategroupTrigger=function(){return this.setters.toggleMap[this.state.allToggled].collapseText},n}();[".ds-accordion-container",".ds-accordion-container-sm",".ds-accordion-container-md",".ds-accordion-container-lg"].map(function(t){s(t).map(function(t){return new d(t)})});var u=function(){function t(t){var i=this;this.els={container:t,condensedIndicator:void 0,indicatorWrap:e(".ds-carousel-position-indicator",t)||void 0,itemsWrap:e(".ds-carousel-items",t),items:s(".ds-carousel-items > div",t),indicators:s(".ds-indicator",t),playPause:e(".ds-carousel-pause",t),controls:[{el:e(".ds-left",t),dir:"left"},{el:e(".ds-right",t),dir:"right"}]||void 0},this.state={activeIndex:0,itemsWidth:0,paused:!1,noArrows:void 0,autoplayInterval:void 0,intervalVal:this.els.container.getAttribute("data-interval")||3e3,condensed:this.els.items.length>5,looping:a(this.els.container,"ds-infinite"),autoplay:a(this.els.container,"ds-autoplay"),numbered:a(this.els.container,"ds-carousel-controls-number")},this.setters={slideMap:{updateClasses:{update:function(t,e){t.map(function(t){return t.classList.remove(e)}),t[i.state.activeIndex].classList.add(e)}},right:{updateSlide:function(){return i.state.activeIndex+=1}},left:{updateSlide:function(){return i.state.activeIndex-=1}}},enableArrow:function(t){i.state.noArrows||(i.els.controls[t].el.style.opacity=1,i.els.controls[t].el.classList.remove("ds-disabled"),i.els.controls[t].el.setAttribute("tabindex","0"))},disableArrow:function(t){i.state.noArrows||(i.els.controls[t].el.style.opacity=0,i.els.controls[t].el.classList.add("ds-disabled"),i.els.controls[t].el.setAttribute("tabindex","-1"))},carouselPaused:{true:{updateCarousel:function(){clearInterval(i.state.autoplayInterval),i.els.playPause.classList.add("ds-icon-play-m-l"),i.els.playPause.classList.remove("ds-icon-pause-m-l")}},false:{updateCarousel:function(){i.state.autoplayInterval=setInterval(function(){i.main(i.els.controls[1])},3e3),i.els.playPause.classList.remove("ds-icon-play-m-l"),i.els.playPause.classList.add("ds-icon-pause-m-l")}}}},this.injectible={setIndicatorWrap:function(){var t=n('\n        <div class="ds-carousel-position-indicator '+(i.state.numbered?"":"ds-circle")+'">\n        '+(!i.state.autoplay&&'<div class="ds-carousel-arrow ds-left '+(i.state.looping?"":"ds-disabled")+'" aria-label="previous">\n              <span class="ds-icon-caret-left-m-l ds-icon-size-default"></span>\n            </div>\n\n            <div class="ds-carousel-arrow ds-right" aria-label="next" role="button" tabindex="0">\n              <span class="ds-icon-caret-right-m-l ds-icon-size-default"></span>\n            </div>\n          </div>')+"\n      ");i.els.container.appendChild(t)},registerIndicatorElements:function(){i.els.indicatorWrap=e(".ds-carousel-position-indicator",i.els.container),i.els.controls=[{el:e(".ds-left",t),dir:"left"},{el:e(".ds-right",t),dir:"right"}],i.state.noArrows=null===i.els.controls[0].el||null===i.els.controls[0].el},pauseNode:function(){var t=n("\n      <div>\n      "+(i.state.condensed?"<div>"+i.injectible.condensed+"</div>":"<div>"+i.injectible.indicators+"</div>")+'\n      <div style="display: flex; justify-content: flex-end;">\n      <span style="cursor: pointer; transform: translateY(-35px);" tabIndex="0"\n      class="ds-carousel-pause ds-icon-size-default ds-icon-pause-m-l"></span>\n      </div>\n      </div>\n      ');i.els.indicatorWrap.insertBefore(t,i.els.controls[1].el),i.els.playPause=e(".ds-carousel-pause",i.els.indicatorWrap)},indicatorNode:function(){var t=n(i.state.condensed?"<div>"+i.injectible.condensed+"</div>":"<div>"+i.injectible.indicators+"</div>");i.els.indicatorWrap.insertBefore(t,i.els.controls[1].el)},indicators:this.els.items.map(function(t,e){return'<div class="ds-indicator ds-clickable'+(0===e?" ds-selected":"")+'" tabindex="0" data-index='+e+">\n    "+(i.state.numbered?e+1:"")+"\n    </div>"}).join(""),condensed:'\n    <div class="ds-text-align-center">\n    <span class="ds-carousel-condensed-current">'+(this.state.activeIndex+1)+"</span> / "+this.els.items.length+"\n    </div>\n    "},this.condenseObserver=new MutationObserver(function(){i.els.condensedIndicator.innerHTML=i.state.activeIndex+1}),this.mounted()}return t.prototype.mounted=function(){var t=this;this.setItemsWidth(),this.injectElements();this.state.noArrows||function(){t.els.controls.map(function(e){o(e.el,"click",function(){return!r(e.el)&&t.main(e)}),o(e.el,"keydown",function(s){c(s)&&!r(e.el)&&t.main(e)})})}(),function(){t.state.condensed?(t.els.condensedIndicator=e(".ds-carousel-condensed-current",t.els.container),t.obs=t.condenseObserver.observe(t.els.itemsWrap,{attributes:!0})):t.els.indicators.map(function(e){o(e,"click",function(){return t.progressDirectly(e)}),o(e,"keydown",function(s){return c(s)&&t.progressDirectly(e)})})}(),this.state.autoplay&&function(){t.state.autoplayInterval=setInterval(function(){t.main(t.els.controls[1])},t.state.intervalVal),o(t.els.playPause,"click",function(){return t.pauseCarousel()}),o(t.els.playPause,"keydown",function(e){return c(e)&&t.pauseCarousel()})}(),function(){t.state.looping?t.els.controls.map(function(e,s){return t.setters.enableArrow(s)}):t.hideInactiveControls()}()},t.prototype.main=function(t){this.navigate(t.dir),this.updateCarouselClasses(),this.translateSlide()},t.prototype.setItemsWidth=function(){var t=this;this.state.itemsWidth=100/this.els.items.length,this.els.items.map(function(e){return e.style.width=t.state.itemsWidth+"%"}),this.els.itemsWrap.style.width=100*this.els.items.length+"%"},t.prototype.injectElements=function(){this.els.indicatorWrap||(this.injectible.setIndicatorWrap(),this.injectible.registerIndicatorElements()),this.state.autoplay?this.injectible.pauseNode():this.injectible.indicatorNode(),this.state.numbered?this.els.indicatorWrap.classList.add("ds-number"):this.els.indicatorWrap.classList.add("ds-circle"),this.els.indicators=s(".ds-indicator",this.els.indicatorWrap)},t.prototype.progressDirectly=function(t){this.state.activeIndex=parseInt(t.getAttribute("data-index")),this.updateCarouselClasses(),this.translateSlide(),this.state.looping||this.hideInactiveControls()},t.prototype.hideInactiveControls=function(){this.state.activeIndex>0?this.setters.enableArrow(0):this.setters.disableArrow(0),this.state.activeIndex!==this.els.items.length-1?this.setters.enableArrow(1):this.setters.disableArrow(1)},t.prototype.navigate=function(t){var e=this.setters.slideMap[t];switch(!0){case 1===this.state.activeIndex&&"left"===t&&!this.state.looping:return e.updateSlide(),void this.setters.disableArrow(0);case(0===this.state.activeIndex||-1===this.state.activeIndex)&&"left"===t:return this.state.activeIndex=this.els.items.length,void e.updateSlide();case this.state.activeIndex===this.els.items.length-1&&"right"===t:return void(this.state.looping&&(this.state.activeIndex=-1,e.updateSlide()));case this.state.activeIndex===this.els.items.length-2&&"right"===t&&!this.state.looping:return e.updateSlide(),void this.setters.disableArrow(1);default:return this.setters.enableArrow(0),this.setters.enableArrow(1),void e.updateSlide()}},t.prototype.updateCarouselClasses=function(t){var e=this.setters.slideMap.updateClasses;!this.state.condensed&&e.update(this.els.indicators,"ds-selected"),e.update(this.els.items,"ds-show")},t.prototype.pauseCarousel=function(){this.state.paused=!this.state.paused,this.setters.carouselPaused[this.state.paused].updateCarousel()},t.prototype.translateSlide=function(){var t=this.state.activeIndex*this.state.itemsWidth;this.els.itemsWrap.style.transform="translateX(-"+t+"%)"},t}();s(".ds-carousel").map(function(t){return new u(t)});var p=function(){function t(t){var n=this;this.els={selectAllEl:e(".ds-input-select-all",t),checkboxEls:s(".ds-input-checkbox input",t)},this.state={groupChecked:this.els.checkboxEls.filter(function(t){return t.checked}).length===this.els.checkboxEls.length},this.els.selectAllEl&&o(this.els.selectAllEl,"click",function(){return n.main()})}return t.prototype.main=function(){this.state.groupChecked=!this.state.groupChecked,this.updateChecks(this.els.checkboxEls,this.state.groupChecked)},t.prototype.updateChecks=function(t,e){t.forEach(function(t){return t.checked=e})},t}();s(".ds-input-checkbox-group").map(function(t){return new p(t)});var h=function(){function t(t,e){this.els={singles:t,groups:e},this.mounted()}return t.prototype.mounted=function(){var t=this;this.els.singles&&this.els.singles.map(function(s,n){var i=t.els.singles[n];o(e("button",i),"click",function(){return t.disappear(s,!0)})}),this.els.groups&&this.els.groups.map(function(e){return o(e,"click",function(){return t.dismissGroup(e)})})},t.prototype.disappear=function(t,e){t.classList.add("ds-fade"),setTimeout(function(){e?t.parentNode.removeChild(t):t.remove(),t=null},300)},t.prototype.dismissGroup=function(t){var e=this;s("."+t.getAttribute("data-group")).map(function(t){return e.disappear(t,!1)})},t}(),f=s(".ds-dismissible").length>0?s(".ds-dismissible"):null,m=s(".ds-dismiss-all").length>0?s(".ds-dismiss-all"):null;new h(f,m);var g=function(){function n(n){var i=this;this.els={container:n,filter:e("input",n),trigger:e(".ds-title",n),optionWrap:e(".ds-options",n),options:s(".ds-option",n)},this.state={activeItem:e("ds-open",this.els.container),activeFilter:this.els.filter&&this.els.filter.value,open:a(n,"ds-open"),triggerType:a(n,"ds-hover")?"mouseenter":"click",activeOptions:this.els.options.filter(function(t){return!r(t)}),lastDisabled:r(this.els.options[this.els.options.length-1])},this.setters={closeListener:function(e){var s=i.els,n=s.options,o=t(s,["options"]);0===Object.keys(o).filter(function(t){return o[t]===e.target}).length&&-1===n.indexOf(e.target)&&(i.main(),i.handleCloseListener("remove"))},stylesMap:{true:{toggle:function(){return n.classList.add("ds-open")},aria:"false",index:0},false:{toggle:function(){return n.classList.remove("ds-open")},aria:"true",index:-1}}},this.mounted()}return n.prototype.mounted=function(){var t=this;this.els.lastItem=this.state.lastDisabled?this.els.options.length-2:this.els.options.length-1;this.els.filter&&function(){o(t.els.filter,"keyup",function(){t.state.activeFilter=t.setActiveFilter(),t.filterOptions(t.els.options)})}(),function(){o(t.els.trigger,t.state.triggerType,function(){return!r(t.els.container)&&t.main()})}(),function(){o(t.els.container,"keydown",function(e){c(e)&&-1===t.els.options.indexOf(e.target)&&t.main(!0),27===e.which&&t.state.open&&t.main(!0)})}(),this.state.activeOptions.map(function(e){o(e,"click",function(){t.state.activeItem=e,t.main()}),o(e,"keydown",function(s){9===s.which&&t.tabOff(s.target),c(s)&&(t.state.activeItem=e,t.main(!0))})})},n.prototype.main=function(t){this.state.open=!this.state.open,!0!==t&&this.state.open?this.handleCloseListener("add"):this.handleCloseListener("remove");var e=this.updateStyles(this.state.open);this.sideEffects(e,this.state.open,this.els)},n.prototype.handleCloseListener=function(t){"add"===t?e("body").addEventListener(this.state.triggerType,this.setters.closeListener,!0):e("body").removeEventListener(this.state.triggerType,this.setters.closeListener,!0)},n.prototype.updateStyles=function(t){var e=this.setters.stylesMap[t];return t?e.toggle():setTimeout(function(){e.toggle()},200),e},n.prototype.sideEffects=function(t,e,s){l(s.optionWrap,"height",!e),s.optionWrap.setAttribute("aria-hidden",t.aria),s.options.map(function(e){return r(e)?e.setAttribute("tabindex","-1"):e.setAttribute("tabindex",t.index)})},n.prototype.setActiveFilter=function(){return this.els.filter.value.trim()},n.prototype.tabOff=function(t){this.els.options.indexOf(t)===this.els.lastItem&&this.main(!0)},n.prototype.filterOptions=function(t){var e=this,s=t.filter(function(t){return-1===t.innerText.toLowerCase().indexOf(e.state.activeFilter.toLowerCase())});t.map(function(t){return-1!==s.indexOf(t)?t.style.display="none":t.style.display="inherit"})},n}();s(".ds-dropdown").map(function(t){return new g(t)});var v=function(){function s(t){var s=this;this.els={container:t,toHide:null!==e(".hide-me",t)?e(".hide-me",t):e(".ds-clamp-text",t),trigger:e(".ds-hide-show",t)},this.state={hidden:null!==this.els.toHide?a(this.els.toHide,"ds-hide"):a(this.els.clampText,"ds-hide"),clampStatus:a(this.els.toHide,"ds-clamp-text")&&!0,clampValue:this.els.container.getAttribute("data-clamp")||null,initialText:void 0,clampedText:void 0},this.setters={toggleMap:{true:{btnContent:"Show More",toggleContent:function(){return s.els.toHide.classList.add("ds-hide")}},false:{btnContent:"Show Less",toggleContent:function(){return s.els.toHide.classList.remove("ds-hide")}}},clampSuite:{cloneInfo:function(t){var e=t.cloneNode(!0);return[e,parseInt(window.getComputedStyle(t).getPropertyValue("line-height").replace("px",""))*s.state.clampValue,e.textContent.split(" ")]},checkClampHeight:function(t,e,n){for(var i=0;i<=t.length;i++){if(e.textContent=e.textContent.concat([" "+t[i]]),e.classList.remove("ds-hide"),e.scrollHeight>n){var o=e.textContent.split(" ");s.state.clampedText=o.splice(0,o.length-1).join(" "),e.textContent=s.state.clampedText;break}e.classList.add("ds-hide")}}}},this.mounted()}return s.prototype.mounted=function(){var t=this;if(a(this.els.toHide,"ds-clamp-text")){var e=this.setters.clampSuite.cloneInfo(this.els.toHide);this.setClamp(e)}a(this.els.toHide,"ds-clamp-text")?o(this.els.trigger,"click",function(){return t.clampToggle()}):o(this.els.trigger,"click",function(){return t.main()})},s.prototype.setClamp=function(t){var e=t[0],s=t[1],n=t[2];this.state.initialText=e.textContent,e.textContent="",this.els.container.insertBefore(e,this.els.toHide),this.setters.clampSuite.checkClampHeight(n,e,s),this.wipeDefaultNode(e)},s.prototype.wipeDefaultNode=function(t){this.els.container.removeChild(this.els.toHide),this.els.toHide=t,this.els.toHide.classList.remove("ds-hide")},s.prototype.main=function(){this.state.hidden=!this.state.hidden;var t=this.updateStyles();this.sideEffects(t,this.state.hidden)},s.prototype.clampToggle=function(){this.state.clampStatus=!this.state.clampStatus,this.els.toHide.textContent=this.updateClampText(this.state),this.sideEffects(this.setters.toggleMap[this.state.clampStatus])},s.prototype.updateClampText=function(e){var s=e.clampStatus,n=e.initialText,i=e.clampedText;t(e,["clampStatus","initialText","clampedText"]);return!1===s?n:i},s.prototype.updateStyles=function(){var t=this.setters.toggleMap[this.state.hidden];return t.toggleContent(),t},s.prototype.sideEffects=function(t,e){this.els.toHide.setAttribute("aria-hidden",e),this.els.trigger.textContent=t.btnContent},s}();s(".ds-expand-collapse").map(function(t){return new v(t)});var y=function(){function t(t){this.els={container:t,msg:e(".ds-file-upload-msg",t),uploadTrigger:e(".ds-file-upload",t),removalTriggers:s(".ds-icon-close-circle",t)},this.state={uploaded:[]},this.mounted()}return t.prototype.mounted=function(){var t=this;o(this.els.uploadTrigger,"change",function(e){return t.main(e)}),this.updateRemovalListener()},t.prototype.main=function(t){this.state.uploaded=this.getFile(t.target),this.els.removalTriggers=this.addFileNode(),this.updateMessage(this.state.uploaded),this.updateRemovalListener()},t.prototype.getFile=function(t){var e=t.files||void 0;if(e&&e.length>=0){var s=e[e.length-1];return this.state.uploaded.concat([s])}},t.prototype.addMessageNode=function(t){return 0===t.length?"No file selected":t.length+" files selected"},t.prototype.updateMessage=function(t){var e=this.addMessageNode(t),i=s(".ds-file-name",this.els.container)[0];if(void 0===this.els.msg){var o=n('\n        <p class="ds-margin-top-0_5 ds-file-upload-msg">\n          '+e+"\n        </p>\n      ");this.els.container.insertBefore(o,i)}else this.els.msg.innerText=e},t.prototype.addFileNode=function(){var t=this.state.uploaded[this.state.uploaded.length-1].name,s=n('\n      <div class="ds-file-name" id="'+t+'">\n        '+t+'\n        <span class="ds-heading-4 ds-icon-close-circle\n        ds-clickable" aria-label="remove" role="botton"></span>\n      </div>\n    ');return this.els.container.appendChild(s),[e(".ds-icon-close-circle",s)].concat(this.els.removalTriggers)},t.prototype.updateRemovalListener=function(){var t=this;this.els.removalTriggers.map(function(e){return o(e,"click",function(e){return t.removeFile(e.target)})})},t.prototype.removeFile=function(t){var e=t.parentElement;this.state.uploaded=this.state.uploaded.filter(function(t){return t.name.replace(/ /g,"")!==e.innerText.replace(/ /g,"")}),e.remove(),this.updateMessage(this.state.uploaded)},t}();s(".ds-file-upload-container").map(function(t){return new y(t)});var b=function(){function t(t){var s=this;this.els={jumpTrigger:t,elToJump:e("#"+t.getAttribute("data-element"))},this.state={scrollPoint:this.els.elToJump&&this.els.elToJump.offsetTop-30,currentOffset:0},o(this.els.jumpTrigger,"click",function(){return s.main()})}return t.prototype.main=function(){window.scrollTo({top:this.state.scrollPoint,behavior:"smooth"}),this.state.currentOffset=this.state.scrollPoint},t}();s(".ds-jump-link").map(function(t){return new b(t)});var w=function(){function t(t){var i=this;this.els={container:t,overlay:e(".ds-overlay",t)||e(".ds-overlay-focus",t)||e(".ds-overlay-fullscreen",t),box:e(".ds-overlay-box",t),content:e(".ds-overlay-content",t),closeTrigger:e(".ds-close-button",t)},this.state={open:a(this.els.overlay,"ds-open")},this.setters={overlayTriggers:s('[data-element="'+this.els.overlay.getAttribute("id")+'"]'),toggleMap:{true:{toggleOverlay:function(){i.els.overlay.classList.add("ds-open"),e("body").style.overflow="hidden"}},false:{toggleOverlay:function(){i.els.overlay.classList.remove("ds-open"),e("body").style.overflow="auto"}}},outsideListener:function(t){t.target!==i.els.content&&-1===s("*",i.els.content).indexOf(t.target)&&(i.main(),i.handleOutsideListener("remove"))}},this.injectible={closeBtn:function(){var s=n('\n        <button type="button" class="ds-close ds-button ds-flat\n          ds-close-button-right ds-close-button"\n          aria-label="close" tabindex="0">\n          <span class="ds-icon-close"></span>\n        </button>\n      ');i.els.box.insertBefore(s,i.els.content),i.els.closeTrigger=e(".ds-close-button",t)}},this.mounted()}return t.prototype.mounted=function(){var t=this;this.els.closeTrigger||this.injectible.closeBtn(),this.state.open&&this.manageAttributes(this.state.open),this.setters.overlayTriggers.length>0&&this.setters.overlayTriggers.map(function(e){return o(e,"click",function(){return t.main()})})},t.prototype.main=function(t){var e=this;this.state.open=!this.state.open,"close"!==t&&this.state.open?this.handleOutsideListener("add"):this.handleOutsideListener("remove"),this.manageAttributes(this.state.open),setTimeout(function(){e.setters.toggleMap[e.state.open].toggleOverlay()},200)},t.prototype.manageAttributes=function(t){this.els.overlay.setAttribute("aria-hidden",!t),t?this.els.overlay.removeAttribute("hidden"):this.els.overlay.setAttribute("hidden",!0)},t.prototype.handleOutsideListener=function(t){"add"===t?e("body").addEventListener("click",this.setters.outsideListener,!0):e("body").removeEventListener("click",this.setters.outsideListener,!0)},t}();s(".ds-overlay-container").map(function(t){return new w(t)});var x=function(){function s(t){var s=this;this.els={wrapper:t,bar:e(".ds-progress",t),counter:e(".ds-progress-counter",t)||null},this.state={min:parseInt(this.els.bar.getAttribute("data-min-value")),max:parseInt(this.els.bar.getAttribute("data-max-value")),current:parseInt(this.els.bar.getAttribute("data-value")),width:0},this.progressObserver=new MutationObserver(function(){s.state.current=parseInt(s.els.bar.getAttribute("data-value")),s.main()}),this.main(),this.progressObserver.observe(this.els.bar,{attributes:!0})}return s.prototype.main=function(){this.state.width=this.setWidth(this.state),this.updateWidth(this.state)},s.prototype.setWidth=function(e){var s=e.current,n=e.max,i=e.min;t(e,["current","max","min"]);return s/(n+i)},s.prototype.updateWidth=function(t){var e=this.getWidthString(t);return this.sideEffects.apply(this,[e].concat(t))},s.prototype.sideEffects=function(e,s){var n=s.min,i=s.current,o=s.width;t(s,["min","current","width"]);this.els.bar.style.width=e+"%",this.els.counter&&(this.els.counter.innerText=e,this.els.counter.style.left=i>=n?"calc("+100*o+"% - 40px)":100*o+"%")},s.prototype.getWidthString=function(t){switch(!0){case t.width>=1:return"100";case t.current<t.min:return"0";default:return""+Math.floor(100*t.width)}},s}();s(".ds-progress-bar").map(function(t){return new x(t)});var L=function(){function t(t){this.els={container:t,navSection:s(".ds-nav-section",t),navItems:s(".ds-nav-item",t),subItems:s(".ds-nav-sub-item",t),allItems:[]},this.state={activeItem:e("ds-active",t),expandedSections:s("ds-expanded",t)},this.mounted()}return t.prototype.mounted=function(){var t=this;this.els.allItems=this.els.navItems.concat(this.els.subItems),this.els.allItems.map(function(e){return o(e,"click",function(){return t.main(e)})})},t.prototype.main=function(t){if(t.hasAttribute("data-child")){var s=e("#"+t.getAttribute("data-child"),this.els.container);this.expandSections(s)}a(t,"ds-nav-section")||this.setActiveItem(t)},t.prototype.setActiveItem=function(t){this.wipeItems(),this.state.activeItem=t,this.state.activeItem.classList.add("ds-active")},t.prototype.wipeItems=function(){this.els.allItems.map(function(t){return t.classList.remove("ds-active")})},t.prototype.expandSections=function(t){-1===this.state.expandedSections.indexOf(t)?(this.state.expandedSections=this.state.expandedSections.concat([t]),t.classList.add("ds-expanded")):(this.state.expandedSections=this.state.expandedSections.filter(function(e){return e!==t}),t.classList.remove("ds-expanded"))},t}();s(".ds-side-nav").map(function(t){return new L(t)});var C=function(){function t(t){var n=this;this.els={container:t,sectionWrap:e('.ds-scrollspy-el[id="'+t.getAttribute("data-element")+'"]'),sections:s('.ds-scrollspy-el[id="'+t.getAttribute("data-element")+'"] .ds-scrollspy-section'),triggers:s("[data-scrollspy]",t)},this.state={activeSection:{},isNavItem:!1,buffer:parseInt(this.els.sectionWrap.getAttribute("data-offset"))||50,sectionTops:this.els.sections.map(function(t){return{offset:window.pageYOffset+t.getBoundingClientRect().top+t.scrollHeight,sectionLink:n.getSectionLink(t),section:t}}),containerDim:{top:window.pageYOffset+this.els.sectionWrap.getBoundingClientRect().top,bottom:window.pageYOffset+this.els.sectionWrap.getBoundingClientRect().bottom}},this.mounted()}return t.prototype.mounted=function(){var t=this;setInterval(function(){return t.main()},100)},t.prototype.main=function(){this.checkBounds(),this.checkSection()},t.prototype.checkBounds=function(){var t=this;(window.pageYOffset>this.state.containerDim.bottom||window.pageYOffset<this.state.containerDim.top)&&this.state.sectionTops.map(function(e){t.checkForNav(e.sectionLink)&&e.sectionLink.classList.remove("ds-active"),e.sectionLink.setAttribute("data-scrollspy-active",!1)})},t.prototype.checkForNav=function(t){return a(t,["ds-nav-item","ds-nav-sub-item","ds-nav-section"]).length>0},t.prototype.checkSection=function(){var t=this;this.state.sectionTops.map(function(e,s){Math.abs(window.pageYOffset-e.offset)<=t.state.buffer&&t.updateSection(e)})},t.prototype.updateSection=function(t){this.setSpyState(t),this.state.isNavItem=this.checkForNav(this.state.activeSection.sectionLink),this.sideEffects()},t.prototype.setSpyState=function(t){this.state.activeSection=t},t.prototype.sideEffects=function(){var t=this;this.state.isNavItem&&this.state.activeSection.sectionLink.classList.add("ds-active"),this.state.sectionTops.map(function(e){t.checkForNav(e.sectionLink)&&e.sectionLink.classList.remove("ds-active"),e.sectionLink.setAttribute("data-scrollspy-active",e.section===t.state.activeSection.section)})},t.prototype.getSectionLink=function(t){return this.els.triggers.filter(function(e){return e.getAttribute("data-scrollspy")===t.getAttribute("id")})[0]},t}();s(".ds-scrollspy").map(function(t){return new C(t)});var T=function(){function t(t){this.els={container:t,controlsContainer:e(".ds-tab-controls",t),controls:s(".ds-button",e(".ds-tab-controls",t)),contentContainer:e(".ds-tab-contents",t),content:s(".ds-tab-content",e(".ds-tab-contents",t))},this.state={activeTab:e(".ds-selected",this.els.container)||null,activeControls:this.els.controls.filter(function(t){return!r(t)}),activeContent:e(".ds-selected",this.els.container)?e("#"+e(".ds-selected",this.els.container).getAttribute("data-element"),this.els.contentContainer):null},this.mounted()}return t.prototype.mounted=function(){var t=this;this.state.activeContent&&this.state.activeContent.classList.remove("ds-hide"),this.state.activeControls.map(function(e){o(e,"click",function(){return t.setActiveTab(e)})})},t.prototype.setActiveTab=function(t){this.state.activeTab=t,this.state.activeContent=e("#"+this.state.activeTab.getAttribute("data-element"),this.els.container),this.sideEffects()},t.prototype.sideEffects=function(){this.els.content.map(function(t){return t.classList.add("ds-hide")}),this.els.controls.map(function(t){return t.classList.remove("ds-selected")}),this.state.activeContent&&this.state.activeContent.classList.remove("ds-hide"),this.state.activeTab.classList.add("ds-selected")},t}();s(".ds-tabs").map(function(t){return new T(t)});var S=function(){function n(e){var n=this;this.els={container:e,trayEls:s(".ds-tray",e)},this.state={items:[]},this.setters={toggleMap:{true:{attr:"false",toggle:function(t){n.els.container.classList.add("ds-tray-open"),t.content.classList.add("ds-open")}},false:{attr:"true",toggle:function(t){n.els.container.classList.remove("ds-tray-open"),t.content.classList.remove("ds-open")}}},outsideListener:function(e){n.state.items.forEach(function(i){i.open,i.hover,i.sideTray;var o=t(i,["open","hover","sideTray"]);0===Object.keys(o).filter(function(t){return o[t]===e.target||-1!==s("*",o[t]).indexOf(e.target)}).length&&(n.main(i),n.handleOutsideListener("remove"))})}},this.mounted()}return n.prototype.mounted=function(){var t=this;this.state.items=this.setSubItems(),this.state.items.forEach(function(e){e.hover?t.eventConditions(e):e.trigger&&o(e.trigger,"click",function(){return t.main(e,e.open)})})},n.prototype.eventConditions=function(t){var e=this,n=function(n,i){"mouseleave"===n?i.toElement!==t.content&&-1===s("*",t.content).indexOf(i.toElement)?e.main(t):t.open=!t.open:e.main(t),o(t.content,"mouseleave",function(s){return e.main(t)})};["mouseenter","mouseleave"].map(function(e){t.trigger&&o(t.trigger,e,function(t){return n(e,t)})})},n.prototype.setSubItems=function(){var t=this;return this.els.trayEls.map(function(s){return{content:s,trigger:e('.ds-tray-activate[data-element="'+s.getAttribute("id")+'"]',t.els.container)||e(".ds-tray-activate",t.els.container),open:a(s,"ds-tray-open"),hover:a(s,"ds-tray-hover-open"),sideTray:a(s,"ds-tray-left")||a(s,"ds-tray-right")}})},n.prototype.main=function(t,e){this.setTrayState(t);var s=this.updateStyles(t);this.sideEffects(s,t),e&&this.handleOutsideListener("remove"),t.open&&!t.hover&&this.handleOutsideListener("add")},n.prototype.setTrayState=function(t){t.open=!t.open},n.prototype.updateStyles=function(t){var e=this.setters.toggleMap[t.open];return t.open?e.toggle(t):setTimeout(function(){e.toggle(t)},200),e},n.prototype.sideEffects=function(e,s){var n=s.content,i=s.open,o=s.sideTray;t(s,["content","open","sideTray"]);!o&&l(n,"height",!i),n.setAttribute("aria-hidden",e.attr)},n.prototype.handleOutsideListener=function(t){"add"===t?e("body").addEventListener("click",this.setters.outsideListener,!0):e("body").removeEventListener("click",this.setters.outsideListener,!0)},n}();s(".ds-tray-container").map(function(t){return new S(t)});var k=function(){function s(s){var n=this;this.els={container:s,trigger:e(".ds-tooltip-trigger",s),content:e(".ds-tooltip-content",s)},this.state={smallContent:void 0,caretWidth:25,activeDetails:{},tooltipShown:!1,position:this.els.content.getAttribute("data-position")||"bottom",openOnHover:a(this.els.container,"ds-hover"),leftCalc:{left:function(){return n.els.content.offsetWidth<n.els.container.offsetWidth?Math.abs(n.els.container.offsetWidth/2)-n.els.content.offsetWidth-n.state.caretWidth:.85*n.els.content.offsetWidth-n.state.caretWidth},right:function(){return n.els.content.offsetWidth<n.els.container.offsetWidth?Math.abs(n.els.container.offsetWidth/2)+1.15*n.els.content.offsetWidth+n.state.caretWidth:.85*n.els.content.offsetWidth+n.state.caretWidth}},topCalc:{leftRight:function(){return n.els.content.offsetHeight>n.els.trigger.offsetHeight?n.els.trigger.offsetHeight-n.els.content.offsetHeight:0},top:function(){return n.els.content.offsetWidth<n.els.trigger.offsetWidth?n.els.trigger.offsetHeight+n.state.caretWidth/2:n.els.trigger.offsetHeight+n.els.content.offsetHeight-n.state.caretWidth/2},bottom:function(){return n.els.trigger.offsetHeight+n.state.caretWidth/2}}},this.setters={tooltipMap:{true:{activate:function(){n.els.container.classList.add("ds-open"),n.els.content.style.opacity=1,n.els.content.setAttribute("aria-hidden",n.state.tooltipShown)}},false:{activate:function(){n.els.container.classList.remove("ds-open"),n.els.content.style.opacity=0,n.els.content.setAttribute("aria-hidden",n.state.tooltipShown)}}},positionVals:{left:{left:"-"+this.state.leftCalc.left()+"px",top:"-"+this.state.topCalc.leftRight()+"px",overflow:"visible"},right:{left:this.state.leftCalc.right()+"px",top:"-"+this.state.topCalc.leftRight()+"px",overflow:"visible"},top:{left:"50%",top:"-"+this.state.topCalc.top()+"px",overflow:"visible"},bottom:{left:"50%",top:this.state.topCalc.bottom()+"px",overflow:"visible"}},closeListener:function(e){var s=n.els,i=(s.content,t(s,["content"]));0===Object.keys(i).filter(function(t){return i[t]===e.target}).length&&n.main(),n.handleCloseListener("remove")}},this.mounted()}return s.prototype.mounted=function(){var t=this;this.state.activeDetails=this.getOffsets(),this.eventType=this.state.openOnHover?["mouseenter","mouseleave"]:["click"],this.eventType.map(function(e){return o(t.els.container,e,function(){return t.main()})}),o(this.els.container,"keydown",function(e){c(e)&&t.main()})},s.prototype.main=function(t){this.state.tooltipShown=!this.state.tooltipShown,this.state.tooltipShown&&!0!==t?this.handleCloseListener("add"):this.handleCloseListener("remove"),this.sideEffects(this.state.tooltipShown),this.activateStyles(this.state.activeDetails,this.els.content)},s.prototype.getOffsets=function(){return this.setters.positionVals[this.state.position]},s.prototype.sideEffects=function(t){this.setters.tooltipMap[t].activate()},s.prototype.activateStyles=function(t,e){Object.keys(t).map(function(s){return-1!==t[s].indexOf("--")?e.style[s]=t[s].replace("--","-"):e.style[s]=t[s]})},s.prototype.handleCloseListener=function(t){"add"===t?e("body").addEventListener("click",this.setters.closeListener,!0):e("body").removeEventListener("click",this.setters.closeListener,!0)},s}();s(".ds-tooltip").map(function(t){return new k(t)});var I=function(){return{Accordion:d,Carousel:u,CheckboxGroup:p,Dismissible:h,Dropdown:g,ExpandCollapse:v,FileUpload:y,JumpLink:b,Overlay:w,ProgressBar:x,SideNav:L,Scrollspy:C,Tabs:T,Tray:S,Tooltip:k}},A={"ds-accordion-container":{init:function(t){return new d(t)}},"ds-accordion-container-sm":{init:function(t){return new d(t)}},"ds-accordion-container-md":{init:function(t){return new d(t)}},"ds-accordion-container-lg":{init:function(t){return new d(t)}},"ds-carousel":{init:function(t){return new u(t)}},"ds-input-checkbox-group":{init:function(t){return new p(t)}},"ds-dismissible":{init:function(t){return new h(t)}},"ds-dropdown":{init:function(t){return new g(t)}},"ds-expand-collapse":{init:function(t){return new v(t)}},"ds-file-upload-container":{init:function(t){return new y(t)}},"ds-jump-link":{init:function(t){return new b(t)}},"ds-overlay-container":{init:function(t){return new w(t)}},"ds-progress-bar":{init:function(t){return new x(t)}},"ds-scrollspy":{init:function(t){return new C(t)}},"ds-tabs":{init:function(t){return new T(t)}},"ds-tooltip":{init:function(t){return new k(t)}},"ds-tray-container":{init:function(t){return new S(t)}}},O=function(t){i(t.classList).forEach(function(e){if(A[e])return A[e].init(t)})};return new MutationObserver(function(t){t.filter(function(t){return t.addedNodes.length>0}).map(function(t){var e=t.addedNodes[0];return e instanceof Element&&O(e)})}).observe(document.querySelector("body"),{childList:!0,subtree:!0}),I}();
