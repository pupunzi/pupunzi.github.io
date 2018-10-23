/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.balloon.js                                                                                                                       _
 _ last modified: 30/03/15 22.50                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matbicoc@gmail.com                                                                                                                       _
 _ site: https://pupunzi.com                                                                                                                         _
 _       https://open-lab.com                                                                                                                        _
 _ blog: https://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  https://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    https://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    https://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2015. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/

(function ($) {

	/* ------------------------------------------------------------------------------------------------------------------------------------------------
	 * Bez @VERSION
	 * https://github.com/rdallasgray/bez
	 *
	 * A plugin to convert CSS3 cubic-bezier co-ordinates to jQuery-compatible easing functions
	 *
	 * With thanks to Nikolay Nemshilov for clarification on the cubic-bezier maths
	 * See https://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
	 *
	 * Copyright @YEAR Robert Dallas Gray. All rights reserved.
	 * Provided under the FreeBSD license: https://github.com/rdallasgray/bez/blob/master/LICENSE.txt
	 */
	jQuery.extend({bez: function (a, b) {
		if (jQuery.isArray(a) && (b = a, a = "bez_" + b.join("_").replace(/\./g, "p")), "function" != typeof jQuery.easing[a]) {
			var c = function (a, b) {
				var c = [null, null], d = [null, null], e = [null, null], f = function (f, g) {return e[g] = 3 * a[g], d[g] = 3 * (b[g] - a[g]) - e[g], c[g] = 1 - e[g] - d[g], f * (e[g] + f * (d[g] + f * c[g]))}, g = function (a) {return e[0] + a * (2 * d[0] + 3 * c[0] * a)}, h = function (a) {
					for (var d, b = a, c = 0; ++c < 14 && (d = f(b, 0) - a, !(Math.abs(d) < .001));)b -= d / g(b);
					return b
				};
				return function (a) {return f(h(a), 1)}
			};
			jQuery.easing[a] = function (a, d, e, f, g) {return f * c([b[0], b[1]], [b[2], b[3]])(d / g) + e}
		}
		return a
	}});
	/*
	 * ------------------------------------------------------------------------------------------------------------------------------------------------
	 * */

	jQuery.balloon = {
		name    : "jquery.mb.balloon",
		version : "1.1",
		author  : "Matteo Bicocchi",
		defaults: {
			addclose         : false,
			addoverlay       : false,
			overlaycolor     : "#000000",
			overlayopacity   : .5,
			target           : "self",
			css              : null,
			highlight        : false,
			onlyonce         : false,
			ease             : [.23, .68, .4, 1.2], //[0, .96, 0, 1.02],
			animTime         : 200,
			bgcolor          : "#333333",
			bordercolor      : "#ffffff",
			textcolor        : "#ffffff",
			oncursor         : false,
			event            : "click",
			position         : "auto", // or: up, down, left, right
			timer            : 0, // close the balloon after x millis (0 = never)
			delay            : 500,
			canclosecondition: function (balloon) {return true;},
			storeData        : true,
			balloon          : "This is an mb.balloon"
		},

		balloonTransitions: {
			slide_left : {marginLeft: -150, opacity: 0},
			slide_right: {marginLeft: 150, opacity: 0},
			slide_up   : {marginTop: -150, opacity: 0},
			slide_down : {marginTop: 150, opacity: 0}
		},

		init: function (opt) {

			jQuery("body").on("click focus", "[data-balloon]", function (e) {
				if (!$(this).data("event") || $(this).data("event") == "click")
					$(this).showBalloon(e, opt, true);
			});

			jQuery("body").on("mouseenter", "[data-balloon]", function (e) {
				if ($(this).data("event") == "hover") {
					$(this).showBalloon(e, opt, true);
				}
			});

			jQuery("body").on("mouseleave", "[data-balloon]", function (e) {
				if ($(this).data("event") == "hover" && !$(this).data("addclose")) {
					$(this).hideBalloon(true);
				}
			});

			jQuery("body").on("blur", "[data-balloon]", function (e) {
				$(this).hideBalloon();
			});

		},

		show: function (event, opt, anim) {

			if (typeof anim == "undefined")
				anim = true;

			var $self = this;
			var self = $self[0];

			if (self.isOpened)
				return;

			if (event && event.type == "mouseenter" && !self.isDelaied) {
				self.isDelaied = true;
				self.delay = setTimeout(function () {
					$self.showBalloon(event, opt, anim);
				}, 100);

				return;
			}

			if (!self.isInit) {
				self.opt = {};

				if (typeof opt == "object") {
					jQuery.extend(self.opt, jQuery.balloon.defaults, $self.data(), opt);
				} else if (typeof opt == "string") {
					self.opt.balloon = opt;
				} else {
					jQuery.extend(self.opt, jQuery.balloon.defaults, $self.data());
				}

				self.isInit = true;

			} else {

				jQuery.extend(self.opt, $self.data());

			}

			$self.addClass("mbBalloonOpener");

			if (typeof event == "undefined")
				self.opt.oncursor = false;

			if ((self.opt.onlyonce && self.displayed) || self.isOpened) {
				jQuery(".mbBalloonOpener").not($self).each(function () {
					if (this.displayed)
						jQuery(this).hideBalloon(null, {}, false);
				});
				return;
			}

			self.displayed = true;
			self.isOpened = true;
			self.isAjax = false;

			self.$balloonContainer = jQuery("<div/>").addClass("mbBalloon").css({opacity: 0, zIndex: 10002});

			if (self.opt.bgcolor)
				self.$balloonContainer.css({backgroundColor: self.opt.bgcolor, borderColor: self.opt.bordercolor});

			if (self.opt.textcolor)
				self.$balloonContainer.css({color: self.opt.textcolor});

			if (self.opt.css)
				self.$balloonContainer.addClass(self.opt.css);

			self.balloonContainer = self.$balloonContainer.get(0);
			self.balloonContainer.opener = self;
			self.balloonContainer.$opener = $self;

			var content;
			// place the content
			if (typeof self.opt.balloon == "object") {

				// is a DOM element
				content = self.opt.balloon.html();
				self.$balloonContainer.append(content);

				if(self.opt.storeData)
					$self.data("balloon", content);

			} else if (typeof self.opt.balloon == "string" && self.opt.balloon.indexOf("{ajax}") > -1) {

				self.isAjax = true;

				// is an AJAX URL
				var url = self.opt.balloon.replace("{ajax}", "");
				jQuery.get(url, function (data) {
					self.$balloonContainer.append(data);
					$self.data("balloon", data);
					$self.trigger("ajaxcontentready");
				});

			} else if (typeof self.opt.balloon == "string" && self.opt.balloon.indexOf("{element}") > -1) {

				// is the ID of a DOM element
				var el = self.opt.balloon.replace("{element}", "");
				content = $(el).html();
				self.$balloonContainer.append(content);
				if(self.opt.storeData)
					$self.data("balloon", content);

			} else {

				// is a string
				self.$balloonContainer.html(self.opt.balloon);

			}

			if (self.opt.addclose) {

				self.opt.addoverlay = true;
				var close = jQuery("<div/>").addClass("mbBalloonClose");
				self.$balloonContainer.append(close);
				self.$balloonContainer.addClass("hasClose");

				close.on("click", function () {
					$self.hideBalloon();
				})

			};

			var target = self.opt.target != "self" ? jQuery(self.opt.target) : $self;

			function displayBalloon() {

				if (self.opt.event == "click" && !$self.data("delay"))
					self.opt.delay = 0;

				self.delay = setTimeout(function () {

					if (self.opt.highlight) {
						$self.addClass("highlight");
						$self.parents().css({zIndex: "auto"});
					}

					if (self.opt.addoverlay) {
						var opacity = 0;
						if (jQuery(".mbBalloonOverlay").length) {
							jQuery(".mbBalloonOverlay").remove();
							opacity = 1;
						}

						var balloonOverlay = jQuery("<div/>").addClass("mbBalloonOverlay").css({zIndex: 1000, opacity: opacity, background: self.opt.overlaycolor});
						balloonOverlay.get(0).opener = $self;
						jQuery("body").before(balloonOverlay);

						balloonOverlay.append(self.$balloonContainer);

						balloonOverlay.on("click", function () {
							if (!self.opt.addclose)
								$self.hideBalloon();
						});

						if (self.opt.highlight || self.opt.addoverlay) {
							self.position = $self.css("position");
							if ($self.css("position") == "static")
								$self.css("position", "relative");

							if ($self.css("background-color") == "transparent" || $self.css("background-color") == "rgba(0, 0, 0, 0)")
								$self.css({
									"background-color": "inherit"
								});
						}

					} else {

						jQuery("body").before(self.$balloonContainer);

						setTimeout(function () {
							jQuery(document).on("click.mbBalloon", function (e) {
								if ((!jQuery(e.target).is(".mbBalloon") && !jQuery(e.target).parents().is(".mbBalloon")) && !jQuery(e.target).is($self)) {
									$self.hideBalloon();
									jQuery(document).off("click.mbBalloon");
								}
							})
						}, 100)

					}

					var arrow = $("<div>").addClass("arrow");
					var arrowBorder = arrow.clone().addClass("border");
					arrowBorder.css({borderColor: self.opt.bgcolor});

					self.$balloonContainer.prepend(arrowBorder).prepend(arrow);

					jQuery("body").before(self.$balloonContainer);

					jQuery(window).off("resize.mbBalloon").on("resize.mbBalloon", function () {

						if (self.isOpened) {
							clearTimeout(self.repos);
							$self.hideBalloon(false, null);
							self.repos = setTimeout(function () {
								self.isOpened = false;
								$self.showBalloon(null, self.opt, false);
							}, 500)
						}
					});

					self.pos = $self.setBalloonPosition(event, target);

					if (anim) {

						if (self.opt.addoverlay) {

							balloonOverlay.fadeTo(self.opt.animTime, self.opt.overlayopacity, function () {
								jQuery(".mbBalloonOpener").not($self).each(function () {
									if (this.displayed)
										jQuery(this).hideBalloon(null, {}, false);
								});
								jQuery("body").css({overflow: "hidden"});
								self.$balloonContainer.css(jQuery.balloon.balloonTransitions["slide_" + self.pos]);
								self.$balloonContainer.animate({marginLeft: 0, marginTop: 0, opacity: 1}, self.opt.animTime, $.bez(self.opt.ease));
							});

						} else {

							self.$balloonContainer.css(jQuery.balloon.balloonTransitions["slide_" + self.pos]);
							self.$balloonContainer.animate({marginLeft: 0, marginTop: 0, opacity: 1}, self.opt.animTime, $.bez(self.opt.ease));
							jQuery(".mbBalloonOpener").not($self).each(function () {
								if (this.displayed)
									jQuery(this).hideBalloon(null, {}, false);
							});

						}
						$self.addClass("mbBalloonOpened");

					} else {

						balloonOverlay.css({opacity: self.opt.overlayopacity});
						self.$balloonContainer.css({opacity: 1});
						jQuery("body").css({overflow: "hidden"});
						$self.addClass("mbBalloonOpened");

					}

					if (self.opt.timer && !self.opt.addclose)
						self.closeTimeout = setTimeout(function () {
							$self.hideBalloon();
						}, self.opt.timer);
				}, self.opt.delay);

				$self.one("mouseleave", function () {clearTimeout(self.delay)});

			}

			if (self.isAjax) {
				$self.on("ajaxcontentready", function () {

					var images = $("img", self.$balloonContainer);
					if (images.length) {
						var x = 0;
						images.each(function () {
							$(this).on("load", function () {
								++x;
								if (x == images.length)
									displayBalloon()
							});
						})

					} else {
						displayBalloon()
					}
				});

				self.isAjax = false;
			} else {

				displayBalloon();

			}

			return $self;
		},

		hide: function (anim, callBack) {

			anim = typeof anim == "undefined" ? true : anim;

			var $self = this.is(".mbBalloon") ? this[0].$opener : this;
			var self = $self[0];

			self.isDelaied = false;
			self.isOpened = false;
			clearTimeout(self.closeTimeout);
			clearTimeout(self.delay);

			var $balloon = self.$balloonContainer;

			if (!$balloon){
				return;
			}

			if (!this.length || (self.$balloonContainer.length && !self.$balloonContainer.is(":visible")))
				return;

			if (typeof self.opt.canclosecondition == "string")
				self.opt.canclosecondition = eval(self.opt.canclosecondition);

			if (typeof self.opt.canclosecondition == "function" && !self.opt.canclosecondition(self.$balloonContainer))
				return false;

			$balloon.trigger("closeBalloon");

			if ($balloon && $balloon.length) {

				var overlay = jQuery(".mbBalloonOverlay").get(0);

				if (anim) {

					$balloon.animate(jQuery.balloon.balloonTransitions["slide_" + self.pos], self.opt.animTime, $.bez(self.opt.ease), function () {
						jQuery(this).remove();
						$self.removeClass("highlight");
						$self.removeClass("mbBalloonOpened");
						jQuery("body").css("overflow", "visible");

						if (overlay && overlay.opener.is($self)) {
							jQuery(overlay).fadeOut(self.opt.animTime, function () {
								$(this).remove();

								if (typeof callBack == "function")
									callBack();

							});

						}

						$self.css("position", self.position);

						if (self.$containment && !self.$containment.is("body"))
							self.$containment.css("overflow", self.containment.overflow);
					});

				} else {

					$self.removeClass("highlight");
					$self.removeClass("mbBalloonOpened");

					$balloon.remove();
					$self.removeClass("highlight");
					self.displayed = false;

					if (overlay && overlay.opener.is($self))
						jQuery(overlay).remove();

					$self.css("position", self.position);

					jQuery("body").css("overflow", "visible");

					if (self.$containment && !self.$containment.is("body"))
						self.$containment.css("overflow", self.containment.overflow);
				}

				$self.removeClass("mbBalloonOpener");

			}
		},

		setPos: function (event, opener) {

			var $self = this;
			var self = $self[0];
			var arrow = self.$balloonContainer.find(".arrow");

			if (typeof event == "undefined")
				self.opt.oncursor = false;

			self.$containment = opener.parents().filter(function () {
				return jQuery(this).is("body") || (!jQuery(this).is("td, tr, table, tbody") && jQuery(this).css("overflow") != "visible");
			}).eq(0);

			self.containment = self.$containment.get(0);
			self.containment.center = {top: (self.$containment.outerHeight() / 2), left: (self.$containment.outerWidth() / 2)};

			if (self.opt.addoverlay) {
				self.containment.overflow = self.$containment.css("overflow");
				self.$containment.css("overflow", "hidden");
			}

			/* get the center of the containment */
			var centerLeft = self.$containment.outerWidth() / 2;
			var centerTop = self.$containment.outerHeight() / 2;

			var targetTop = self.opt.oncursor ? event.pageY || opener.offset().top : opener.offset().top;
			var targetLeft = self.opt.oncursor ? event.pageX || opener.offset().left : opener.offset().left;
			var targetWidth = self.opt.oncursor ? 1 : opener.outerWidth();
			var targetHeight = self.opt.oncursor ? 1 : opener.outerHeight();

			var center = {top: targetTop + (targetHeight), left: targetLeft + (targetWidth / 2)};

			if (Math.abs(center.top - centerTop) > Math.abs(center.left - centerLeft))
			//up or down?
				self.balloonPos = center.top > centerTop ? "up" : "down";
			else
			//left or right
				self.balloonPos = center.left > centerLeft ? "left" : "right";

			if (self.opt.position != "auto")
				self.balloonPos = self.opt.position;

			var balloonTop, balloonLeft;
			var arrowTop, arrowLeft;

			switch (self.balloonPos) {

				case "up":
					balloonTop = targetTop - self.$balloonContainer.outerHeight() - arrow.outerHeight() / 2;
					balloonLeft = (targetLeft + targetWidth / 2) - (self.$balloonContainer.outerWidth() / 2);
					arrowTop = self.$balloonContainer.outerHeight() - 1;
					arrowLeft = (self.$balloonContainer.outerWidth() / 2) - (arrow.outerWidth() / 2);
					arrow.addClass("s");
					self.$balloonContainer.addClass("s");
					break;

				case "down":
					balloonTop = targetTop + targetHeight + arrow.outerHeight() / 2;
					balloonLeft = (targetLeft + targetWidth / 2) - (self.$balloonContainer.outerWidth() / 2);
					arrowTop = -arrow.outerHeight() / 2;
					arrowLeft = self.$balloonContainer.outerWidth() / 2 - arrow.outerWidth() / 2;
					arrow.addClass("n");
					self.$balloonContainer.addClass("n");
					break;

				case "left":
					balloonTop = targetTop + (targetHeight / 2) - (self.$balloonContainer.outerHeight() / 2);
					balloonLeft = targetLeft - self.$balloonContainer.outerWidth() - arrow.outerWidth();
					arrowTop = (self.$balloonContainer.outerHeight() / 2 - arrow.outerHeight() / 2);
					arrowLeft = self.$balloonContainer.outerWidth() - 1;
					arrow.addClass("e");
					self.$balloonContainer.addClass("e");
					break;

				case "right":
					balloonTop = targetTop + (targetHeight / 2) - self.$balloonContainer.outerHeight() / 2;
					balloonLeft = (targetLeft + targetWidth) + arrow.outerWidth();
					arrowTop = (self.$balloonContainer.outerHeight() / 2 - arrow.outerHeight() / 2);
					arrowLeft = -arrow.outerWidth() / 2;
					arrow.addClass("w");
					self.$balloonContainer.addClass("w");
					break;

				default:
					balloonTop = targetTop - self.$balloonContainer.outerHeight() - arrow.outerHeight() / 2;
					balloonLeft = (targetLeft + targetWidth / 2) - (self.$balloonContainer.outerWidth() / 2);
					arrowTop = self.$balloonContainer.outerHeight() - 1;
					arrowLeft = (self.$balloonContainer.outerWidth() / 2) - (arrow.outerWidth() / 2);
					arrow.addClass("s");
					self.$balloonContainer.addClass("s");
					break;
			}

			if (balloonLeft < (jQuery("body").offset().left + jQuery(window).scrollLeft())) {

				balloonTop = targetTop + (targetHeight / 2) - self.$balloonContainer.outerHeight() / 2;
				balloonLeft = (targetLeft + targetWidth) + arrow.outerWidth();
				arrowTop = (self.$balloonContainer.outerHeight() / 2 - arrow.outerHeight() / 2);
				arrowLeft = -arrow.outerWidth() / 2;
				self.$balloonContainer.removeClass("n s e w");
				arrow.removeClass("n s e w");
				arrow.addClass("w");
				self.$balloonContainer.addClass("w");
				self.balloonPos = "right"
			}

			if (balloonLeft + self.$balloonContainer.outerWidth() - 50 > jQuery(window).width() + jQuery(window).scrollLeft()) {

				balloonTop = targetTop + (targetHeight / 2) - (self.$balloonContainer.outerHeight() / 2);
				balloonLeft = targetLeft - self.$balloonContainer.outerWidth() - arrow.outerWidth();
				arrowTop = (self.$balloonContainer.outerHeight() / 2 - arrow.outerHeight() / 2);
				arrowLeft = self.$balloonContainer.outerWidth() - 1;
				self.$balloonContainer.removeClass("n s e w");
				arrow.removeClass("n s e w");
				arrow.addClass("e");
				self.$balloonContainer.addClass("e");
				self.balloonPos = "left"
			}


			if (balloonTop < jQuery(window).scrollTop()) {

				if (self.balloonPos == "left" || self.balloonPos == "right") {
					var diff = (self.$containment.offset().top + jQuery(window).scrollTop()) - balloonTop + 10;

					balloonTop = balloonTop + diff;
					arrowTop -= diff;

					arrowTop = arrowTop < 0 ? 20 : arrowTop;
				}

				if (self.balloonPos == "up") {
					balloonTop = targetTop + targetHeight + arrow.outerHeight() / 2;
					balloonLeft = (targetLeft + targetWidth / 2) - (self.$balloonContainer.outerWidth() / 2);
					arrowTop = -arrow.outerHeight();
					arrowLeft = self.$balloonContainer.outerWidth() / 2 - arrow.outerWidth() / 2;
					arrow.removeClass("n s e w");
					arrow.addClass("n");
					self.$balloonContainer.removeClass("n s e w");
					self.$balloonContainer.addClass("n");
					self.balloonPos = "down"
				}
			}

			if (balloonTop + self.$balloonContainer.outerHeight() - 50 > jQuery(window).height() + jQuery(window).scrollTop()) {

				balloonTop = targetTop - self.$balloonContainer.outerHeight() - arrow.outerHeight() / 2;
				balloonLeft = (targetLeft + targetWidth / 2) - (self.$balloonContainer.outerWidth() / 2);
				arrowTop = self.$balloonContainer.outerHeight();
				arrowLeft = (self.$balloonContainer.outerWidth() / 2) - (arrow.outerWidth() / 2);
				arrow.removeClass("n s e w");
				arrow.addClass("s");
				self.$balloonContainer.removeClass("n s e w");
				self.$balloonContainer.addClass("s");
				self.balloonPos = "up"

			}

			if (balloonLeft < 0) {
				arrowLeft += balloonLeft - 10;
				balloonLeft = 10;
			}

			if (balloonTop < 0) {
				balloonTop = 10;
			}

			self.$balloonContainer.css({top: balloonTop, left: balloonLeft});
			arrow.css({top: arrowTop, left: arrowLeft});

			return self.balloonPos;
		},

		getBalloon: function () {
			var $self = this;
			var self = $self[0];
			return self.$balloonContainer;
		},

		getOpener: function () {
			var $self = this;
			var self = $self[0];
			return self.$opener;
		}

	};

	/* Public methods */
	jQuery.fn.showBalloon = jQuery.balloon.show;
	jQuery.fn.hideBalloon = jQuery.balloon.hide;
	jQuery.fn.setBalloonPosition = jQuery.balloon.setPos;
	jQuery.fn.getBalloon = jQuery.balloon.getBalloon;
	jQuery.fn.getOpener = jQuery.balloon.getOpener;

})(jQuery);
