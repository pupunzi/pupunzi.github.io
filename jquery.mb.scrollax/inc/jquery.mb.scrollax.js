/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.scrollax.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 27/01/14 20.08
 *  *****************************************************************************
 */

/*Browser detection patch*/
var nAgt=navigator.userAgent;if(!jQuery.browser){jQuery.browser={},jQuery.browser.mozilla=!1,jQuery.browser.webkit=!1,jQuery.browser.opera=!1,jQuery.browser.safari=!1,jQuery.browser.chrome=!1,jQuery.browser.msie=!1,jQuery.browser.ua=nAgt,jQuery.browser.name=navigator.appName,jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var nameOffset,verOffset,ix;if(-1!=(verOffset=nAgt.indexOf("Opera")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=nAgt.substring(verOffset+6),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8));else if(-1!=(verOffset=nAgt.indexOf("OPR")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=nAgt.substring(verOffset+4);else if(-1!=(verOffset=nAgt.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=nAgt.substring(verOffset+5);else if(-1!=nAgt.indexOf("Trident")){jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer";var start=nAgt.indexOf("rv:")+3,end=start+4;jQuery.browser.fullVersion=nAgt.substring(start,end)}else-1!=(verOffset=nAgt.indexOf("Chrome"))?(jQuery.browser.webkit=!0,jQuery.browser.chrome=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=nAgt.substring(verOffset+7)):-1!=(verOffset=nAgt.indexOf("Safari"))?(jQuery.browser.webkit=!0,jQuery.browser.safari=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("AppleWebkit"))?(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("Firefox"))?(jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=nAgt.substring(verOffset+8)):(nameOffset=nAgt.lastIndexOf(" ")+1)<(verOffset=nAgt.lastIndexOf("/"))&&(jQuery.browser.name=nAgt.substring(nameOffset,verOffset),jQuery.browser.fullVersion=nAgt.substring(verOffset+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName));-1!=(ix=jQuery.browser.fullVersion.indexOf(";"))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix)),-1!=(ix=jQuery.browser.fullVersion.indexOf(" "))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix)),jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10),isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10)),jQuery.browser.version=jQuery.browser.majorVersion}jQuery.browser.android=/Android/i.test(nAgt),jQuery.browser.blackberry=/BlackBerry|BB|PlayBook/i.test(nAgt),jQuery.browser.ios=/iPhone|iPad|iPod|webOS/i.test(nAgt),jQuery.browser.operaMobile=/Opera Mini/i.test(nAgt),jQuery.browser.windowsMobile=/IEMobile|Windows Phone/i.test(nAgt),jQuery.browser.kindle=/Kindle|Silk/i.test(nAgt),jQuery.browser.mobile=jQuery.browser.android||jQuery.browser.blackberry||jQuery.browser.ios||jQuery.browser.windowsMobile||jQuery.browser.operaMobile||jQuery.browser.kindle,jQuery.isMobile=jQuery.browser.mobile,jQuery.isTablet=jQuery.browser.mobile&&jQuery(window).width()>765,jQuery.isAndroidDefault=jQuery.browser.android&&!/chrome/i.test(nAgt);

var ua = navigator.userAgent.toLowerCase();
var isAndroid = /android/.test(ua);
var isiOs = /(iphone|ipod|ipad)/.test(ua);

/*events mapping*/
var isDevice = 'ontouchstart' in window;
var events = {};
events.start = isDevice ? "touchstart" : "mousedown";
events.move = isDevice ? "touchmove" : "mousemove";
events.end = isDevice ? "touchend" : "mouseup";
events.winResize = "resize";

/*jquery.mousewheel.js
 *! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 * Version: 3.0.6
 * Requires: 1.2.2+
 */
(function (d) {
	function e(a) {
		var b = a || window.event, c = [].slice.call(arguments, 1), f = 0, e = 0, g = 0;
		a = d.event.fix(b);
		a.type = "mousewheel";
		b.wheelDelta && (f = b.wheelDelta / 120);
		b.detail && (f = -b.detail / 3);
		g = f;
		void 0 !== b.axis && b.axis === b.HORIZONTAL_AXIS && (g = 0, e = -1 * f);
		void 0 !== b.wheelDeltaY && (g = b.wheelDeltaY / 120);
		void 0 !== b.wheelDeltaX && (e = -1 * b.wheelDeltaX / 120);
		c.unshift(a, f, e, g);
		return(d.event.dispatch || d.event.handle).apply(this, c)
	}

	var c = ["DOMMouseScroll", "mousewheel"];
	if (d.event.fixHooks)for (var h = c.length; h;)d.event.fixHooks[c[--h]] = d.event.mouseHooks;
	d.event.special.mousewheel = {setup: function () {if (this.addEventListener)for (var a = c.length; a;)this.addEventListener(c[--a], e, !1); else this.onmousewheel = e}, teardown: function () {if (this.removeEventListener)for (var a = c.length; a;)this.removeEventListener(c[--a], e, !1); else this.onmousewheel = null}};
	d.fn.extend({mousewheel: function (a) {return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")}, unmousewheel: function (a) {return this.unbind("mousewheel", a)}})
})(jQuery);

/*****************************************************************************/

(function ($) {
	$.scrollax = {
		name    : "jquery.mb.scrollax",
		author  : "Matteo Bicocchi (pupunzi)",
		version : "1.5",
		defaults: {
			elements          : "[data-start]",
			wheelSpeed        : 1,
			//scrollStep should not be changed as this can compromize performance
			scrollStep        : 2,
			scrollSpeed       : 50,
			direction         : "vertical",
			showSteps         : true,
			preloadImages     : true,
			activateKeyboard  :true,
			stopOnlyAtMarkers :true,
			onBeforePreloading: function () {},
			onPreloading      : function (counter, tot) {},
			onEndPreloading   : function () {}
		},

		init: function (options) {
			$.extend($.scrollax.defaults, options);

			if ($.scrollax.defaults.preloadImages) {
				$.scrollax.defaults.onBeforePreloading();
				$.preloadImages(function () {
					$.scrollax.defaults.onEndPreloading();
				});

			}

			$.timeline.wheelSpeed = $.scrollax.defaults.wheelSpeed *  10;
			$.timeline.scrollStep = $.scrollax.defaults.scrollStep *  10;
//			direction works only for touch devices.
			$.timeline.direction = $.scrollax.defaults.direction;
			$.timeline.activateKeyboard = $.scrollax.defaults.activateKeyboard;

			$.scrollax.els = $($.scrollax.defaults.elements);
			$.scrollax.scrolled = 0;
			$.scrollax.maxScroll = 0;
			$.scrollax.els.each(function () {
				$.scrollax.addElement(this);
			});

			$(document).off("timelineChanged.scrollax").on("timelineChanged.scrollax", function (e) {


				// if two evenst have been settend at the same position the last will overwrite the other.
				// todo: make an array of events for each pos.
				if (typeof $.timeline.events[e.pos] === "function") {
					$.timeline.events[e.pos]();
					return;
				}

				$.scrollax.els.each(function () {
					$(this).renderAnimation(e.pos);
				});

				var isPageMarker = $.timeline.pageMarkers.indexOf($.timeline.pos) >= 0;

				if (isPageMarker){
					var event = $.Event("pageMarker");
					event.pageMarker = $.timeline.pos;
					$(document).trigger(event);

					$.timeline.stopMoveBy();
					clearInterval($.timeline.step);

					if($.timeline.animationIsRunning )
						$("body").off("mousewheel.moving").on("mousewheel.moving", function(){
							$.timeline.stopMoveBy();
							return false;
						});


					$(".pageMarker").removeClass("sel");
					$("#slide_"+$.timeline.pos).addClass("sel");

					if($(".pageMarker.clicked").length && $(".pageMarker.clicked").get(0).marker == $.timeline.pos)
						$(".pageMarker.clicked").removeClass("clicked");
				}

			});


		},

		addElement: function (el) {
			var i, $el = $(el);
			el.id = el.id || "id_" + new Date().getTime();

			var position = $el.css("position") == "static" ? "relative" : $el.css("position");
			$el.addClass("scrollaxEl").css({position: position});//, width:$el.css("width"),top:$el.position().top, left: $el.position().left,
			var obj = null;
			if (!$.isEmptyObject($el.data()) && !el.isInit) {
				obj = {};
				obj.id = "anim_1";
				for (i in $el.data()) {
					obj[i] = $el.data()[i];
				}
			}
			obj.id = el.id;
			el.isInit = true;

			/**
			 *
			 * @param start "auto" or (int) scroll position. "auto" will set the object just below the window height.
			 * @param end (int) scroll position; if @duration is defined this will be ignored.
			 * @param duration (int) scroll ticks.
			 * @param startanimation (Object) The CSS that define de start layout of the animation.
			 * @param endanimation (Object) The CSS that define de end layout of the animation.
			 * @constructor
			 **/

			/*Check the window scroll height according to animations timelines ************************/
			$.timeline.frames = $.scrollax.maxScroll;
			$.timeline.buildScroller();

			$el.addScrollax(obj);

			/*Apply the first defined animation to the element ************************/
			var firstAnim = el.scrollax[0];
			var css = {};
			if (firstAnim.startanimation) {
				css = $.scrollax.generateCss(firstAnim.startanimation);
				$el.css(css);
			}
		},

		addScrollax: function (options) {
			var el = this.get(0), obj = options , i;

			$.scrollax.els = $.scrollax.els.add($(el));

			if (typeof obj.start == "number") {
				obj.startScrollPos = obj.start;
			} else {
				obj.startScrollPos = $(el).position().top - $(window).height();
				obj.startScrollPos = obj.startScrollPos < 0 ? 0 : obj.startScrollPos;
			}

			if (typeof obj.end == "number") {
				obj.endScrollPos = obj.end;
			} else {
				obj.endScrollPos = $(el).position().top + ($(window).height() / 2);
			}

			if (typeof obj.duration == "number") {
				obj.endScrollPos = obj.startScrollPos + obj.duration;
			}

			if (obj.startanimation && typeof obj.startanimation == "string") {
				obj.startanimation = JSON.parse(obj.startanimation.replace(/'/g, "\""));
			}

			if (obj.endanimation && typeof obj.endanimation == "string") {
				obj.endanimation = JSON.parse(obj.endanimation.replace(/'/g, "\""));
			}


			if (!el.scrollax)
				el.scrollax = [];

			/*Check the window scroll height according to animations timelines ************************/
			$.scrollax.maxScroll = $.scrollax.maxScroll < obj.endScrollPos + $(window).height() ? obj.endScrollPos + $(window).height() : $.scrollax.maxScroll;
			$.timeline.refresh($.scrollax.maxScroll);

			if ($.scrollax.defaults.showSteps)
				$.scrollax.traceFrames();

			if (obj.customEvent)
				el.customEvent = obj.customEvent;

			el.scrollax.push(obj);
			el.scrollax = $.unique(el.scrollax);

			return this;

		},

		renderAnimation: function (pos) {
			var el = this.get(0), prop;
			for (var i in el.scrollax) {
				var obj = el.scrollax[i];

				if (!obj.startanimation) {
					obj.startanimation = {};
					for (prop in obj.endanimation) {
						if (prop === "scale" || prop === "rotate" || prop === "skew")
							continue;

						if (prop === "backgroundX") {
							obj.startanimation[prop] = parseFloat($(el).css("background-position").split(' ')[0].replace(/[^0-9-]/g, ''));
							continue;
						}
						if (prop === "backgroundY") {
							obj.startanimation[prop] = parseFloat($(el).css("background-position").split(' ')[1].replace(/[^0-9-]/g, ''));
							continue;
						}
						obj.startanimation[prop] = parseFloat($(el).css(prop));
					}
				}

				if (!obj.endanimation) {
					obj.endanimation = {};
					for (prop in obj.startanimation) {
						if (prop === "scale" || prop === "rotate" || prop === "skew")
							continue;
						if (prop === "backgroundX") {
							obj.endanimation[prop] = parseFloat($(el).css("background-position").split(' ')[0].replace(/[^0-9-]/g, ''));
							continue;
						}
						if (prop === "backgroundY") {
							obj.endanimation[prop] = parseFloat($(el).css("background-position").split(' ')[1].replace(/[^0-9-]/g, ''));
							continue;
						}
						obj.endanimation[prop] = parseFloat($(el).css(prop));
					}
				}

				if (pos >= obj.startScrollPos && pos <= obj.endScrollPos) {


					var animVal = $.scrollax.setPropVal(obj, pos);
					var css = $.scrollax.generateCss(animVal);
					$(el).css(css);

					if (el.customEvent)
						el.customEvent(pos, obj);
				}

			}
		},

		generateCss: function (obj) {
			var sfx = "";
			if ($.browser.webkit) {
				sfx = "-webkit-";
			} else if ($.browser.mozilla) {
				sfx = "-moz-";
			} else if ($.browser.opera) {
				sfx = "-o-";
			} else if ($.browser.msie) {
				sfx = "-ms-";
			}
			var css = {};

			for (var prop in obj) {

				if (!css[sfx + "transform"])
					css[sfx + "transform"] = "";

				if (prop === "scale") {
					css[sfx + "transform"] += " scale(" + obj[prop] + ")";
				} else if (prop === "rotate") {
					css[sfx + "transform"] += " rotate(" + obj[prop] + "deg)";
				} else if (prop === "skew") {
					css[sfx + "transform"] += " skew(" + obj[prop] + ")";
				} else if (prop === "origin") {
					css[sfx + "transform-origin"] = obj[prop];
				} else if (prop === "backgroundX") {
					css["background-position"] = obj[prop] + "px ";
				} else if (prop === "backgroundY") {
					if (!css["background-position"])
						css["background-position"] = "0px ";

					css["background-position"] += obj[prop] + "px";
				} else {
					css[prop] = obj[prop];
				}
			}
			return css;
		},

		setPropVal: function (obj, pos) {
			var scrolled = pos - obj.startScrollPos;
			var perc = (scrolled * 100) / (obj.endScrollPos - obj.startScrollPos);

			var animCss = {};
			for (var i in obj.startanimation) {
				var diff = Math.abs(obj.endanimation[i] - obj.startanimation[i]);
				var val = obj.startanimation[i] < obj.endanimation[i] ?
						(obj.startanimation[i] + ((diff * perc) / 100)) : (obj.startanimation[i] - ((diff * perc) / 100));

				//Apply ease effects to the scroll animation
				//f.ex.: $.easing.easeInQuad(null, elapsed, initialValue, amountOfChange, duration)
				//cheat sheet: http://easings.net/
				var ease = obj.ease ? obj.ease : jQuery.easing.def;
				animCss[i] = $.easing[ease](null, scrolled, obj.startanimation[i], obj.endanimation[i] - obj.startanimation[i], obj.endScrollPos - obj.startScrollPos);
			}
			return animCss;
		},

		play: function (speed) {
			if (!speed) speed = 1;
			if ($.scrollax.autoplay) {
				clearInterval($.scrollax.autoplay);
				$.scrollax.autoplay = false;
			} else {
				var playPos = $.timeline.scroller.scrollTop();
				$.scrollax.autoplay = setInterval(function () {
					playPos += speed;
					$.timeline.scroller.scrollTop(playPos);

					if ($.timeline.frames <= ($.timeline.scroller.scrollTop() + $(window).height())) {
						clearInterval($.scrollax.autoplay);
						$.scrollax.autoplay = false;
					}
				}, 1)
			}
		},

		traceFrames: function () {
			$(".tracerStep").remove();
			var step;
			for (var i = 0; i <= $.timeline.frames; i += 20) {
				if (i / 100 === Math.floor(i / 100)) {
					step = $("<div/>").addClass("tracerStep").css({position: "absolute", right: 0, top: i, fontSize: 10, fontFamily: "Helvetica, sans-serif", color: "#fff", borderTop: "1px solid #fff", paddingRight: 10}).html(i);
				} else {
					step = $("<div/>").addClass("tracerStep small").css({position: "absolute", right: 0, top: i, borderBottom: "1px solid rgba(255,255,255,0.3)", paddingRight: 10}).html(" ");
				}
				$.timeline.scroller.append(step);
			}
		},

		createIndex: function(){
			var el = this;
			for(var index in jQuery.timeline.pageMarkers){
				var marker = jQuery.timeline.pageMarkers[index];
				if (typeof marker == "function")
					continue;
				var indexLine = jQuery("<div/>").attr({id: "slide_"+marker}).addClass("pageMarker");
				indexLine.get(0).marker = marker;
				indexLine.on("click",function(){
					jQuery.timeline.moveTo(this.marker);
					$(this).addClass("clicked");
				});
				el.append(indexLine);

				if(marker == $.timeline.pos)
					indexLine.addClass("sel");
			}

		},
		addAnimation: function(from, to, delay, ease, time){

			var el = this;

			if(typeof from == undefined)
				return;

			if(typeof to == undefined)
				return;

			if (!ease)
				ease = "cubic-bezier(0.65,0.03,0.36,0.72)";

			if(!delay)
				delay = 0;

			if(!time)
				time = 1500;

			from = JSON.parse(from.replace(/'/g, "\""));
			to =  JSON.parse(to.replace(/'/g, "\""));


			if ($.timeline.dir == "forward"){
				setTimeout(function(){

					$.timeline.animationIsRunning = true;
					clearTimeout($.timeline.donotmove);
					$.timeline.donotmove = setTimeout(function(){
						$.timeline.animationIsRunning = false;
						$("body").off("mousewheel.moving");
					},1500);

					el.css(from).CSSAnimate(to,time,function(){});
				},delay);

			} else {
				el.css(to).CSSAnimate(from,time,function(){});
			}
		}
	};

	$.timeline = {
		frames       : 4000,
		pos          : 0,
		interval     : 10,
		activateKeyboard : true,
		pageMarkers  : [],

		buildScroller: function () {
			$(".scrollaxerCont").remove();
			var scroller = $("<div/>").addClass("scrollaxer").css({width: 20, height: $.timeline.frames + $(window).height()});
			var scrollerCont = $("<div/>").addClass("scrollaxerCont").css({width: 50, position: "fixed", top: 0, right: 0, overflowX: "hidden", overflowY: $.browser.msie && $.browser.version<9 ? "scroll" : "visible", height: "100%", opacity: .5, zIndex: 9999});
			scrollerCont.append(scroller);
			scrollerCont.unselectable();
			scrollerCont.on("mousewheel", function (event) {
				event.preventDefault();
			});

			if (!isDevice)
				scrollerCont.on("mouseenter",function () {
					$(this).animate({opacity: 1});
				}).on("mouseleave", function () {
					$.timeline.scroller.scrollTop($.timeline.pos);
					$(this).animate({opacity: .5});
				});
			else
				scrollerCont.css({opacity: 1});

			$("body").append(scrollerCont);
			$.timeline.scroller = scrollerCont;

			scrollerCont.on("scroll.scrollax", function () {

				var oldScrolled = $.timeline.pos;
				var newPos = $.timeline.scroller.scrollTop();
				$.timeline.dir = oldScrolled < newPos ? "forward" : "backward";

				if( ($.timeline.dir == "forward" && newPos < oldScrolled + $.timeline.interval) || ($.timeline.dir == "backward" && newPos > oldScrolled - $.timeline.interval) )
					return;

				var event = $.Event("timelineChanged");
				event.pos = newPos;
				$.timeline.pos = newPos;
				$(document).trigger(event);

				if (oldScrolled < newPos) {
					for (var i = oldScrolled ; i <= newPos; i+=$.timeline.interval) {
						event.pos = i;
						$.timeline.dir = "forward";
						$.timeline.pos = i;
						$(document).trigger(event);
					}
				} else if (oldScrolled > newPos){
					for (i = oldScrolled ; i >= newPos; i-=$.timeline.interval) {
						event.pos = i;
						$.timeline.dir = "backward";
						$.timeline.pos = i;
						$(document).trigger(event);
					}
				}else{
					event.pos = $.timeline.pos;
					$(document).trigger(event);
				}

			});

			if (!isDevice) {
				$("body").on("mousewheel", function (event, delta, deltaX, deltaY) {

					if ($.scrollax.autoplay) {
						clearInterval($.scrollax.autoplay);
						$.scrollax.autoplay = false;
					}

					$.timeline.moveBy(-deltaY);
					event.preventDefault();

				});

				if($.timeline.activateKeyboard)
					$.timeline.keyboard();


			} else {

				$.timeline.touch = {};
				$.timeline.touch.x = 0;
				$.timeline.touch.y = 0;

				$("body").on(events.move, function (e) {
					e.preventDefault();
				});

				$("body").off(events.start + ".scrollax").on(events.start + ".scrollax", function (e) {
					var event = e;
					e = e.originalEvent;
					e = e.touches[0];

					$.timeline.touch.x = e.clientX;
					$.timeline.touch.y = e.clientY;
					$.timeline.touch.startPos = $.timeline.pos;
					$.timeline.touch.delta = 0;

					$("body").off(events.move + ".scrollax").on(events.move + ".scrollax", function (e) {
						var event = e;
						e = e.originalEvent;
						e = e.touches[0];

						$.timeline.touch.moveX = e.clientX;
						$.timeline.touch.moveY = e.clientY;
						var d;
						if ($.timeline.direction == "vertical") {
							d = +($.timeline.touch.y - $.timeline.touch.moveY);
							$.timeline.touch.delta = d < 10 && d > -10 ? 0 : d;
						} else {
							d = +($.timeline.touch.x - $.timeline.touch.moveX);
							$.timeline.touch.delta = d < 10 && d > -10 ? 0 : d;
						}
						$.timeline.touch.x = $.timeline.touch.moveX;
						$.timeline.touch.y = $.timeline.touch.moveY;
						$.timeline.moveBy($.timeline.touch.delta);
					});
				});
			}
		},

		keyboard:function(){
			$(document).on("keydown.scrollax",function(e){

				switch(e.keyCode){
					case 38:
						$.timeline.moveBy(-1);
						e.preventDefault();
						break;
					case 40:
						$.timeline.moveBy(1);
						e.preventDefault();
						break;
					default:
						break;
				}
			})
		},

		addPageMarker: function (step) {
			$.timeline.pageMarkers.push(step);
		},

		moveBy       : function (delta) {

			if (($.timeline.isMoving && delta.sign() == $.timeline.runningDeltaSign) || !delta)
				return;


			if($.timeline.step)
				clearInterval($.timeline.step);

			$.timeline.isMoving = true;
			$.timeline.runningDeltaSign = delta.sign();

			var counter = 0;
			function moveSteps () {
				counter++;
				var reallyStop = true;

				if (counter > ($.timeline.wheelSpeed / $.timeline.scrollStep)) {

					if( $.timeline.pageMarkers.length) {
						for (var pmi in $.timeline.pageMarkers) {

							var pm = $.timeline.pageMarkers[pmi];

							if (
									$.timeline.actualPageMarker != pm && (
									(pm > $.timeline.pos && delta.sign() == 1 && pm < ($.timeline.pos + ($.timeline.wheelSpeed * 2) + 1)) ||
									(pm < $.timeline.pos && delta.sign() == -1 && pm > ($.timeline.pos - ($.timeline.wheelSpeed * 2) -1 ))
									)) {

								$.timeline.actualPageMarker = pm;

								clearInterval($.timeline.step);

								reallyStop = false;
								break;
							}
						}

						if (reallyStop && !$.scrollax.defaults.stopOnlyAtMarkers )
							$.timeline.stopMoveBy();
					}

				} else {
					$.timeline.stopMoveBy();
				}

				var d = $.timeline.scrollStep * delta.sign();
				$.timeline.delta = $.timeline.scroller.scrollTop() + d;
				$.timeline.scroller.scrollTop($.timeline.delta);

			}

			$.timeline.step = setInterval(moveSteps, $.scrollax.defaults.scrollSpeed);

		},

		stopMoveBy: function () {

			if($.timeline.step)
				clearInterval($.timeline.step);
			$.timeline.isMoving = false;

		},

		moveTo         : function (val) {
			var time = 1500* Math.ceil(Math.abs((val-$.timeline.scroller.scrollTop())/1000));
			$.timeline.scroller.animate({scrollTop: val}, time, "easeOutQuart");//"easeInOutQuint"
		},

		refresh        : function (val) {
			$.timeline.frames = val;
			$(".scrollaxer").css({height: $.timeline.frames});
		},
		addEvent       : function (frame, func) {
			if (!$.timeline.events)
				$.timeline.events = {};
			$.timeline.events[frame] = func;
		},
		removeEvent    : function (frame) {
			delete $.timeline.events[frame];
		},

		switchDirection: function () {
			if ($.timeline.direction == "vertical") {
				$.timeline.direction = "horizontal";
			} else {
				$.timeline.direction = "vertical";
			}
		}
	};

	$.fn.scrollax = $.scrollax.init;
	$.fn.createPageMarkerIndex = $.scrollax.createIndex;
	$.fn.addAnimation = $.scrollax.addAnimation;
	$.fn.renderAnimation = $.scrollax.renderAnimation;
	$.fn.addScrollax = $.scrollax.addScrollax;



	jQuery.preloadImages = function (callback) {

		var imagesArray = [];

		if($.browser.msie && $.browser.version<9){
			setTimeout(callback,5000);
			return;
		}

		/*Images in stylesheets*/
		var sheets = $("style");//array of stylesheets
		var cssPile = '';//create large string of all css rules in sheet

		sheets.each(function(){//loop through each stylesheet
			cssPile+= $(this).text();
		});

		var imgUrls = cssPile.match(/[^\(]+\.(jpg|jpeg|png)/g);//reg ex to get a string of between a "(" and a ".filename"
		imagesArray = jQuery.makeArray(imgUrls);//jQuery.makeArray(imgUrls);//create array from regex obj

		/*Images in inline style*/
		$('[style*="background"]').each(function () {
			var style = $(this).attr('style').replace("\"","").replace("\'","");

			var pattern = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
			var match = pattern.exec(style);

			if (match && match[2]) {
				imagesArray.push(match[2]);
			}
		});

		/*Images */
		$("img").each(function () {
			var url = $(this).attr("src");
			imagesArray.push(url);
		});

		imagesArray = jQuery.unique(imagesArray);
		var counter = 0;
		for (var x in imagesArray) {
			var img = $("<img/>");
			img.attr("src", imagesArray[x]).on("load",function () {
				counter++;

				$.scrollax.defaults.onPreloading(counter, imagesArray.length);
				if (counter == imagesArray.length && typeof callback == "function")
					callback();
			}).on("error", function(){
				counter++;
				$.scrollax.defaults.onPreloading(counter, imagesArray.length);
				if (counter == imagesArray.length && typeof callback == "function"){
					callback();
				}
			})

		}

		return imagesArray;
	}

})(jQuery);


jQuery.fn.unselectable = function () {
	return this.each(function () {
		jQuery(this).css({
			"-moz-user-select"  : "none",
			"-khtml-user-select": "none",
			"user-select"       : "none"
		}).attr("unselectable", "on");
	});
};

Number.prototype.sign = function () {
	return this > 0 ? 1 : -1;
}

if (!Array.prototype.indexOf){
	Array.prototype.indexOf = function(elt) {
		var len = this.length >>> 0;

		var from = Number(arguments[1]) || 0;
		from = (from < 0)
				? Math.ceil(from)
				: Math.floor(from);
		if (from < 0)
			from += len;

		for (; from < len; from++)
		{
			if (from in this &&
					this[from] === elt)
				return from;
		}
		return -1;
	};
}
