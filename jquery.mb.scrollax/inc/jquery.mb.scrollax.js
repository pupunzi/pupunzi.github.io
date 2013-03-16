/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.scrollax.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
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
 *  last modified: 16/03/13 21.49
 *  *****************************************************************************
 */

/*Browser detection patch*/
(function(){if(!(8>jQuery.fn.jquery.split(".")[1])){jQuery.browser={};jQuery.browser.mozilla=!1;jQuery.browser.webkit=!1;jQuery.browser.opera=!1;jQuery.browser.msie=!1;var a=navigator.userAgent;jQuery.browser.name=navigator.appName;jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion);jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var c,b;if(-1!=(b=a.indexOf("Opera"))){if(jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=a.substring(b+6),-1!=(b= a.indexOf("Version")))jQuery.browser.fullVersion=a.substring(b+8)}else if(-1!=(b=a.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=a.substring(b+5);else if(-1!=(b=a.indexOf("Chrome")))jQuery.browser.webkit=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=a.substring(b+7);else if(-1!=(b=a.indexOf("Safari"))){if(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=a.substring(b+7),-1!=(b=a.indexOf("Version")))jQuery.browser.fullVersion= a.substring(b+8)}else if(-1!=(b=a.indexOf("Firefox")))jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=a.substring(b+8);else if((c=a.lastIndexOf(" ")+1)<(b=a.lastIndexOf("/")))jQuery.browser.name=a.substring(c,b),jQuery.browser.fullVersion=a.substring(b+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName);if(-1!=(a=jQuery.browser.fullVersion.indexOf(";")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0, a);if(-1!=(a=jQuery.browser.fullVersion.indexOf(" ")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,a);jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10);isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10));jQuery.browser.version=jQuery.browser.majorVersion}})(jQuery);

/*******************************************************************************
 * jQuery.mb.components: jquery.mb.CSSAnimate
 ******************************************************************************/


var ua = navigator.userAgent.toLowerCase();
var isAndroid = /android/.test(ua);
var isiOs = /(iphone|ipod|ipad)/.test(ua);
var isOpera = /opera/.test(ua);

/*events mapping*/
var isDevice = 'ontouchstart' in window;
var events = {};
events.start = isDevice ? "touchstart" : "mousedown";
events.move = isDevice ? "touchmove" : "mousemove";
events.end = isDevice ? "touchend" : "mouseup";
events.winResize = isDevice ? "orientationchange" : "resize";

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
	$.timeline = {
		frames         : 4000,
		direction      : "vertical",
		pos            : 0,
		buildScroller  : function () {
			$(".scrollaxerCont").remove();
			var scroller = $("<div/>").addClass("scrollaxer").css({width: 20, height: $.timeline.frames + $(window).height()});
			var scrollerCont = $("<div/>").addClass("scrollaxerCont").css({width: 50, position: "fixed", top: 0, right: 0, overflowX: "hidden", overflowY: "visible", height: "100%", opacity: 0, zIndex: 9999});
			scrollerCont.append(scroller);

			/*
			 scrollerCont.on("mousewheel",function(event){
			 event.preventDefault();
			 });
			 */

			if (!isDevice)
				scrollerCont.on("mouseenter",function () {
					$(this).animate({opacity: 1});
				}).on("mouseleave", function () {
							$.timeline.scroller.scrollTop($.timeline.pos);
							$(this).animate({opacity: 0});
						});
			else
				scrollerCont.css({opacity: 1});

			$("body").append(scrollerCont);
			$.timeline.scroller = scrollerCont;

			scrollerCont.on("scroll.scrollax", function () {

				var oldScrolled = $.timeline.pos;
				var newPos = $.timeline.scroller.scrollTop();
				var event = $.Event("timelineChanged");
				if (oldScrolled < newPos) {
					for (var i = oldScrolled + 1; i <= newPos; i++) {
						event.pos = i;
						$.timeline.dir = "forward";
						$.timeline.pos = i;
						$(document).trigger(event);
					}
				} else {
					for (i = oldScrolled - 1; i >= newPos; i--) {
						event.pos = i;
						$.timeline.dir = "backward";
						$.timeline.pos = i;
						$(document).trigger(event);
					}
				}

				$("#console").html($.timeline.dir);

				event.pos = $.timeline.pos;
				$(document).trigger(event);
			});

			if (!isDevice) {
				$("body").on("mousewheel", function (event, delta, deltaX, deltaY) {
					event.preventDefault();
					if ($.scrollax.autoplay) {
						clearInterval($.scrollax.autoplay);
						$.scrollax.autoplay = false;
					}
					$.timeline.moveBy(-deltaY);
				});
			} else {
				$.timeline.touch = {};
				$.timeline.touch.x = 0;
				$.timeline.touch.y = 0;

				$(document).on(events.move, function (e) {
					event.preventDefault();
				});

				$("body").on(events.start, function (e) {
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
		moveBy         : function (delta) {
			delta = isOpera ? Math.ceil(delta / 2) : isDevice ? delta / 3 : delta;
			delta = Math.ceil(delta > 0 && delta < 1 ? 1 : delta < 0 && delta > -1 ? -1 : delta);
			$.timeline.delta = $.timeline.scroller.scrollTop() + (delta);
			$.timeline.scroller.scrollTop($.timeline.delta);
		},
		moveTo         : function (val) {
			var time = Math.abs(($.timeline.scroller.scrollTop() * 2) - val);
			$.timeline.scroller.animate({scrollTop: val}, time, "linear");//"easeInOutQuint"
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

	$.scrollax = {
		name    : "jquery.mb.scrollax",
		author  : "Matteo Bicocchi (pupunzi)",
		version : "1.1",
		defaults: {
			elements : "[data-start]",
			direction: "vertical",
			showSteps: true
		},

		init: function (options) {
			$.extend($.scrollax.defaults, options);

			$.scrollax.els = $($.scrollax.defaults.elements);
			$.scrollax.scrolled = 0;
			$.scrollax.maxScroll = 0;
			$.scrollax.els.each(function (i) {
				$.scrollax.addElement(this);
			});

			$(document).off("timelineChanged.scrollax").on("timelineChanged.scrollax", function (e) {

				$.scrollax.els.each(function () {
					$(this).renderAnimation(e.pos);
				});
				if (typeof $.timeline.events[e.pos] === "function") {
					$.timeline.events[e.pos]();
				}
			});

			$(window).off(events.winResize + ".scrollax").on(events.winResize + ".scrollax", function () {
				clearTimeout($.scrollax.restart);
				$.scrollax.restart = setTimeout(function () {
					self.location.href = self.location.href;
				}, 150);
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

			el.isInit = true;
			/**
			 *
			 * @param start "auto" or (int) scroll position.
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

			$.scrollax.els.push($(el));

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
				obj.startanimation = eval("(" + obj.startanimation + ")");
			}

			if (obj.endanimation && typeof obj.endanimation == "string") {
				obj.endanimation = eval("(" + obj.endanimation + ")");
			}

			if (!el.scrollax)
				el.scrollax = [];
			el.scrollax.push(obj);
			el.scrollax = $.unique(el.scrollax);

			/*Check the window scroll height according to animations timelines ************************/
			$.scrollax.maxScroll = $.scrollax.maxScroll < obj.endScrollPos + $(window).height() ? obj.endScrollPos + $(window).height() : $.scrollax.maxScroll;
			$.timeline.refresh($.scrollax.maxScroll);
			if ($.scrollax.defaults.showSteps)
				$.scrollax.traceFrames();

			return this;

		},

		renderAnimation: function (pos) {
			var el = this.get(0), x;
			for (var i in el.scrollax) {
				var obj = el.scrollax[i];

				if (!obj.startanimation) {
					obj.startanimation = {};
					for (x in obj.endanimation) {
						if (x === "scale" || x === "rotate" || x === "skew")
							continue;

						if (x === "backgroundX") {
							obj.startanimation[x] = parseFloat($(el).css("background-position").split(' ')[0].replace(/[^0-9-]/g, ''));
							continue;
						}
						if (x === "backgroundY") {
							obj.startanimation[x] = parseFloat($(el).css("background-position").split(' ')[1].replace(/[^0-9-]/g, ''));
							continue;
						}
						obj.startanimation[x] = parseFloat($(el).css(x));
					}
				}

				if (!obj.endanimation) {
					obj.endanimation = {};
					for (x in obj.startanimation) {
						if (x === "scale" || x === "rotate" || x === "skew")
							continue;
						if (x === "backgroundX") {
							obj.endanimation[x] = parseFloat($(el).css("background-position").split(' ')[0].replace(/[^0-9-]/g, ''));
							continue;
						}
						if (x === "backgroundY") {
							obj.endanimation[x] = parseFloat($(el).css("background-position").split(' ')[1].replace(/[^0-9-]/g, ''));
							continue;
						}
						obj.endanimation[x] = parseFloat($(el).css(x));
					}
				}

				if (pos >= obj.startScrollPos && pos <= obj.endScrollPos) {
					var animVal = $.scrollax.setPropVal(obj, pos);
					var css = $.scrollax.generateCss(animVal);
					$(el).css(css);
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

			for (var i in obj) {

				if (!css[sfx + "transform"])
					css[sfx + "transform"] = "";

				if (i === "scale") {
					css[sfx + "transform"] += " scale(" + obj[i] + ")";
				} else if (i === "rotate") {
					css[sfx + "transform"] += " rotate(" + obj[i] + "deg)";
				} else if (i === "skew") {
					css[sfx + "transform"] += " skew(" + obj[i] + ")";
				} else if (i === "origin") {
					css[sfx + "transform-origin"] = obj[i];
				} else if (i === "backgroundX") {
					css["background-position"] = obj[i] + "px ";
				} else if (i === "backgroundY") {
					if (!css["background-position"])
						css["background-position"] = "0px ";

					css["background-position"] += obj[i] + "px";
				} else {
					css[i] = obj[i];
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
				//animCss[i] = val;
				//Apply ease effects to the scroll animation
				//f.ex.: $.easing.easeInQuad(null, elapsed, initialValue, amountOfChange, duration)
				//cheat sheet: http://easings.net/
				var ease = obj.ease ? obj.ease : jQuery.easing.def;
				animCss[i] = $.easing[ease](null, scrolled, obj.startanimation[i], obj.endanimation[i] - obj.startanimation[i], obj.endScrollPos - obj.startScrollPos);
			}
			return animCss;
		},
		play      : function (speed) {
			if (!speed) speed = 10;
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
		}
	};

	$.fn.scrollax = $.scrollax.init;
	$.fn.renderAnimation = $.scrollax.renderAnimation;
	$.fn.addScrollax = $.scrollax.addScrollax;

})(jQuery);
