/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.disclose.js
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
 *  last modified: 07/01/14 22.50
 *  *****************************************************************************
 */

/*Browser detection patch*/
if (!jQuery.browser) {
	jQuery.browser = {};
	jQuery.browser.mozilla = !1;
	jQuery.browser.webkit = !1;
	jQuery.browser.opera = !1;
	jQuery.browser.msie = !1;
	var nAgt = navigator.userAgent;
	jQuery.browser.ua = nAgt;
	jQuery.browser.name = navigator.appName;
	jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion);
	jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;
	if (-1 != (verOffset = nAgt.indexOf("Opera")))jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 6), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)); else if (-1 != (verOffset = nAgt.indexOf("MSIE")))jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer", jQuery.browser.fullVersion = nAgt.substring(verOffset + 5); else if (-1 != nAgt.indexOf("Trident")) {
		jQuery.browser.msie = !0;
		jQuery.browser.name = "Microsoft Internet Explorer";
		var start = nAgt.indexOf("rv:") + 3, end = start + 4;
		jQuery.browser.fullVersion = nAgt.substring(start, end)
	} else-1 != (verOffset = nAgt.indexOf("Chrome")) ? (jQuery.browser.webkit = !0, jQuery.browser.name = "Chrome", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 != (verOffset = nAgt.indexOf("Safari")) ? (jQuery.browser.webkit = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("AppleWebkit")) ? (jQuery.browser.webkit = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("Firefox")) ? (jQuery.browser.mozilla = !0, jQuery.browser.name = "Firefox", jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)) : (nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")) && (jQuery.browser.name = nAgt.substring(nameOffset, verOffset), jQuery.browser.fullVersion = nAgt.substring(verOffset + 1), jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() && (jQuery.browser.name = navigator.appName));
	-1 != (ix = jQuery.browser.fullVersion.indexOf(";")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix));
	-1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix));
	jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10);
	isNaN(jQuery.browser.majorVersion) && (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10));
	jQuery.browser.version = jQuery.browser.majorVersion;
}

/*******************************************************************************
 * jQuery.mb.components: jquery.mb.CSSAnimate
 ******************************************************************************/

jQuery.fn.CSSAnimate=function(a,b,k,l,f){return this.each(function(){var c=jQuery(this);if(0!==c.length&&a){"function"==typeof b&&(f=b,b=jQuery.fx.speeds._default);"function"==typeof k&&(f=k,k=0);"function"==typeof l&&(f=l,l="cubic-bezier(0.65,0.03,0.36,0.72)");if("string"==typeof b)for(var j in jQuery.fx.speeds)if(b==j){b=jQuery.fx.speeds[j];break}else b=null;if(jQuery.support.transition){var e="",h="transitionEnd";jQuery.browser.webkit?(e="-webkit-",h="webkitTransitionEnd"):jQuery.browser.mozilla? (e="-moz-",h="transitionend"):jQuery.browser.opera?(e="-o-",h="otransitionend"):jQuery.browser.msie&&(e="-ms-",h="msTransitionEnd");j=[];for(d in a){var g=d;"transform"===g&&(g=e+"transform",a[g]=a[d],delete a[d]);"transform-origin"===g&&(g=e+"transform-origin",a[g]=a[d],delete a[d]);j.push(g);c.css(g)||c.css(g,0)}d=j.join(",");c.css(e+"transition-property",d);c.css(e+"transition-duration",b+"ms");c.css(e+"transition-delay",k+"ms");c.css(e+"transition-timing-function",l);c.css(e+"backface-visibility", "hidden");setTimeout(function(){c.css(a)},0);setTimeout(function(){c.called||!f?c.called=!1:f()},b+20);c.on(h,function(a){c.off(h);c.css(e+"transition","");a.stopPropagation();"function"==typeof f&&(c.called=!0,f());return!1})}else{for(var d in a)"transform"===d&&delete a[d],"transform-origin"===d&&delete a[d],"auto"===a[d]&&delete a[d];if(!f||"string"===typeof f)f="linear";c.animate(a,b,f)}}})}; jQuery.fn.CSSAnimateStop=function(){var a="",b="transitionEnd";jQuery.browser.webkit?(a="-webkit-",b="webkitTransitionEnd"):jQuery.browser.mozilla?(a="-moz-",b="transitionend"):jQuery.browser.opera?(a="-o-",b="otransitionend"):jQuery.browser.msie&&(a="-ms-",b="msTransitionEnd");jQuery(this).css(a+"transition","");jQuery(this).off(b)}; jQuery.support.transition=function(){var a=(document.body||document.documentElement).style;return void 0!==a.transition||void 0!==a.WebkitTransition||void 0!==a.MozTransition||void 0!==a.MsTransition||void 0!==a.OTransition}();

/*******************************************************************************
 DATA:

 CONTAINERS:

 data-animationin
 data-animationout
 data-time
 data-onenter
 data-onexit
 data-stop

 ELEMENTS:

 data-animate
 data-animationstart
 data-animationend
 data-animationtime
 data-animationdelay
 data-ease
 ******************************************************************************/

(function($){

  $.disclose = {
    name:"mb.disclose",
    author:"Matteo Bicocchi",
    version:"1.1",
    defaults:{
      slideIntervall:5000,
      inTimer:600,
      outTimer:1000,
      ease:"bezier(.24,.85,.32,.92)",
      animationIn:{left:"100%", top:0, opacity:1},
      animationOut:{left:"-100%", top:0, opacity:1},
      autoPlay:false,
      stopOnHover:true,
      activateKeyboard:true,
      indexPlaceHolder:"#slideIndex",
      progressPlaceHolder:"#slideProgress",
      onEnter:function(el, $el, $newEl){},
      onExit:function(el, $el, $newEl){},
      onInit:function(el){}
    },

    init: function(opt){

      /*
       var ua = navigator.userAgent.toLowerCase();
       var isiOs = ua.match(/(iphone|ipod|ipad)/);

       var events={};
       events.start = hasTouch ? "touchstart" : "mousedown";
       events.move = hasTouch ? "touchmove" : "mousemove";
       events.end = hasTouch ? "touchend" : "mouseup";
       events.resize = hasTouch && isiOs ? "orientationchange" : "resize";
       */

      var arg = arguments;

      return this.each(function(){

        var el= this;
        var $el= $(this);
        $el.css({overflow:"hidden"});

        if(typeof arg[0] == "string"){
          switch(arg[0]){
            case "goto":
              $.disclose.goTo(el, arg[1]);
              break;
            case "next":
              $.disclose.next(el, arg[1]);
              break;
            case "prev":
              $.disclose.prev(el, arg[1]);
              break;
            case "play":
              $.disclose.play(el);
              break;
            case "refresh":
              $.disclose.refresh(el);
              break;
          }
          return;
        }

        el.page=0;
        el.canAnimate=true;
        el.hasTouch = 'ontouchstart' in window;

        el.opt = {};
        el.opt.id = el.id ? el.id : "id_"+ new Date().getTime();
        $.extend (el.opt, $.disclose.defaults,opt);

        el.container = $("<div/>").attr("id","mbDiscloseCont_"+el.opt.id);
        el.container.css({position:"absolute",top:-5000,left:-5000});
        $("body").append(el.container);

        var pages = $(el).children();

        pages.css({height: $(el).height(), boxSizing:"border-box", overflow:"hidden"});
        var bannerWrapper = $("<div/>").addClass("mbDiscloseWrapper");
        pages.show();
        el.container.append(pages);
        pages.wrap(bannerWrapper);

        el.pages= el.container.children();

        el.pages.each(function(){
          $(this).data("idx",$(this).index());
        });
        if(el.opt.activateKeyboard)
          $(document).on("keydown", function(e){
            var key= e.which;

            switch(key){
              case 37:
                $.disclose.prev(el,true);
                break;
              case 39:
                $.disclose.next(el,true);
                break;
              case 32:
                $.disclose.play(el);
                break;
            }
          });

        $(window).on("resize",function(){
          $.disclose.refresh(el);
        });


        $.disclose.start(el);
      })
    },

    start:function(el){
      var banner= el.pages.eq(el.page).clone(true);
      banner.children().eq(0).addClass("in");
      banner.hide().css({top:0,left:0, opacity:1});
      $(el).append(banner);
      banner.show();

      var fn= banner.children().eq(0).data("onenter") ? eval("("+banner.children().eq(0).data("onenter")+")") : el.opt.onEnter;
      if(typeof fn == "function")
        fn(el);

      $(el).css("visibility","visible");
      el.actualBanner = banner;


      if($(el.opt.indexPlaceHolder).length>0){
        $.disclose.buildIndex(el);
      }

      $.disclose.animateElements(el);

      if(el.pages.length<=1)
        return;

      if(el.opt.autoPlay){

        var dataTime = banner.children().eq(0).data("time");
        var $newElTime = dataTime ? dataTime : el.opt.slideIntervall;

        el.interval = setTimeout(function(){$(el).disclose("next")},$newElTime);

      }

      if(el.opt.stopOnHover && el.opt.autoPlay)
        $(el).on("mouseenter",function(){
          el.opt.autoPlay=false;
          clearTimeout(el.interval);
        }).on("mouseleave",function(){
                  el.opt.autoPlay=true;
                  $.disclose.showProgress(el);
                  el.interval = setTimeout(function(){$(el).disclose("next")},el.opt.slideIntervall);
                });


      if(el.hasTouch){
        $(el).swipe({
          swipeLeft:function(el){
            $.disclose.next(el);
          },
          swipeRight:function(el){
            $.disclose.prev(el);
          }
        });

        $(el).doubleTap({
          func:function(el){
            $.disclose.play(el);
          }
        })
      }
    },

    next:function(el, stopSlide){

      if(!el.canAnimate || el.pauseSlide)
        return;

      if(stopSlide){
        clearTimeout(el.interval);
        el.opt.autoPlay=false;
      }

      if(el.page < el.pages.length-1)
        el.page++;
      else
        el.page=0;

      $.disclose.goTo(el);
    },

    prev:function(el, stopSlide){

      if(!el.canAnimate)
        return;

      if(stopSlide){
        clearTimeout(el.interval);
        el.opt.autoPlay=false;
      }

      if(el.page > 0)
        el.page--;
      else
        el.page=el.pages.length-1;

      $.disclose.goTo(el);
    },

    goTo:function(el, idx, stop){

      if(el.pages.length<=1)
        return;

      clearTimeout(el.interval);
      if(idx>=0 && idx == el.page)
        return;

      el.page = idx>=0 ? idx : el.page;
      el.page = el.page > el.pages.length-1 ? 0 : el.page;

      el.canAnimate = false;

      var $el = $(el).children().eq(0).css({zIndex:0});

      var $elProp = $el.children().eq(0);
      $elProp.addClass("out");

      var $newEl = el.pages.eq(el.page).clone(true).css({zIndex:1});

      var dataAnimOut = $elProp.data("animationout");
      var $elAnim = dataAnimOut ? dataAnimOut : el.opt.animationOut;
      var $newElProp = $newEl.children().eq(0);
      var dataAnimIn = $newElProp.data("animationin");
      var $newElAnim = dataAnimIn ? dataAnimIn : el.opt.animationIn;
      $newElAnim = $.normalizeTransform($newElAnim);

      var dataTime = $newElProp.data("time");
      var $newElTime = dataTime ? dataTime : el.opt.slideIntervall;

      if($newElProp.data("stop") || stop)
        el.opt.autoPlay=false;

      /*Exit*/
      var fn= $elProp.data("onexit") ? eval("("+$elProp.data("onexit")+")") : el.opt.onExit;
      if(typeof fn == "function")
        fn(el);

      setTimeout(function(){
        $el.CSSAnimate($elAnim, el.opt.outTimer, null, el.opt.ease, function(){
          $el.remove();
          el.canAnimate = true;
        });
      },100);

      $(el).append($newEl);
      $newElProp.removeClass("out");
      $newEl.css($newElAnim);

      /*ENTER*/
      el.actualBanner = $newEl;
      setTimeout(function(){
        el.actualBanner.CSSAnimate({top:0, left:0, opacity:1, transform: "rotate(0deg) scale(1)" }, el.opt.inTimer,null, el.opt.ease, function(){
          el.actualBanner.children().eq(0).addClass("in");
          var fn= $newElProp.data("onenter") ? eval("("+$newElProp.data("onenter")+")") : el.opt.onEnter;
          if(typeof fn == "function")
            fn(el);
        });

        $.disclose.animateElements(el);
        if(el.opt.autoPlay){
          el.interval = setTimeout(function(){$(el).disclose("next")},$newElTime);
        }

        if($(el.opt.indexPlaceHolder).length>0){
          $.disclose.buildIndex(el);
        }

      },100);
    },

    play:function(el){
      clearTimeout(el.interval);
      el.opt.autoPlay = !el.opt.autoPlay;

      if(el.opt.autoPlay){
        $.disclose.next(el);
      }
    },

    animateElements:function(el){

      var $el = el.actualBanner;
      var $els = $el.find("[data-animate=true]");

      $els.each(function(){
        var $el = $(this);
        var cssStart = $el.data("animationstart") ? $el.data("animationstart") : {opacity:0};
        cssStart = $.normalizeTransform(cssStart);
        var cssEnd = $el.data("animationend") ? $el.data("animationend") : {opacity:1};
        cssEnd = $.normalizeTransform(cssEnd);

        var time = $el.data("animationtime") ? $el.data("animationtime") : el.opt.inTimer;
        var cssDelay = $el.data("animationdelay") ? $el.data("animationdelay") : 700;
        var ease = $el.data("ease") ? $el.data("ease") : el.opt.ease;

        $el.css(cssStart);
        setTimeout(function(){
          $el.CSSAnimate(cssEnd, time, cssDelay, el.opt.ease, function(){});
        },100);
      });
    },

    buildIndex:function(el){

      var indexBox = $(el.opt.indexPlaceHolder);
      indexBox.empty();
      if(el.pages.length==1)
        return;
      var idxContainer =$("<div/>").addClass("idxContainer");
      indexBox.append(idxContainer);
      for (var i=0; i< el.pages.length;i++){
        var indexEl=$("<div/>").addClass("idxPage").attr("id","pageIdx_"+i).data("idx",i);
        indexEl.click(function(){
          $.disclose.goTo(el,$(this).data("idx"),true);
        });
        idxContainer.append(indexEl);
      }
      $(".idxPage",indexBox).eq(el.page).addClass("sel");

      $.disclose.showProgress(el);
    },

    showProgress:function(el){
      clearInterval(el.progress);

      if($(el.opt.progressPlaceHolder).length==0)
        return;

      el.startTime= new Date().getTime();

      var progBox = $(el.opt.progressPlaceHolder);
      progBox.empty();
      var progBar = $("<div/>").addClass("progressBar");
      progBox.append(progBar);
      var dataTime = el.actualBanner.children().eq(0).data("time");

      var totTime = dataTime ? dataTime : el.opt.slideIntervall;
      var progress = 0;
      el.progress=setInterval(function(){

        if(!el.opt.autoPlay || progress >= totTime){
          clearInterval(el.progress);
        }

        var prop = (progBox.width()*progress)/totTime;
        progBar.css({width:prop});
        var getTime = new Date().getTime();
        progress= getTime - el.startTime;
      },1);
    },

    refresh:function(el){
      el.pages.children().css({height:$(el).height()});
      el.actualBanner.children().css({height:$(el).height()});
    }

  };

  $.fn.disclose = $.disclose.init;

  /*UTILITIES*/

  $.fn.unselectable=function(){
    this.each(function(){
      $(this).css({
        "-moz-user-select": "none",
        "-khtml-user-select": "none",
        "user-select": "none"
      }).attr("unselectable","on");
    });
    return $(this);
  };

  $.fn.clearUnselectable=function(){
    this.each(function(){
      $(this).css({
        "-moz-user-select": "auto",
        "-khtml-user-select": "auto",
        "user-select": "auto"
      });
      $(this).removeAttr("unselectable");
    });
    return $(this);
  };

  $.normalizeTransform=function(css){
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

    for(var o in css){
      if (o==="transform"){
        css[sfx+"transform"]=css[o];
        delete css[o];
      }
      if (o==="transform-origin"){
        css[sfx+"transform-origin"]=css[o];
        delete css[o];
      }
    }

    return css;
  };


  $.fn.swipe = function(opt) {
    var defaults = {
      time:600,
      diff:400,
      swipeLeft:function() {
      },
      swipeRight:function() {
      }
    };
    $.extend(defaults, opt);
    return this.each(function() {
      this.swipe = {sp:0,ep:0, s:0, e:0};

      this.addEventListener('touchstart', function(event) {
        if(event.touches.length>1){
          this.abort=true;
          return;
        }
        //event.preventDefault();
        var touch = event.touches[0];
        this.swipe.sp = touch.pageX;
        this.swipe.s = new Date().getTime();
      }, false);

      this.addEventListener('touchmove', function(event) {
        event.preventDefault();
      },false);

      this.addEventListener('touchend', function(event) {
        if(this.abort) {
          this.abort=false;
          return;
        }
        //event.preventDefault();
        var touch = event.changedTouches[0];
        this.swipe.ep = touch.pageX;

        if((parseFloat(new Date().getTime()) - parseFloat(this.swipe.s)) > defaults.time && event.touches.length==1)
          return;
        if (this.swipe.ep > this.swipe.sp + defaults.diff) {
          event.stopPropagation();
          defaults.swipeRight(this);
        } else if (this.swipe.ep < this.swipe.sp - defaults.diff) {
          event.stopPropagation();
          defaults.swipeLeft(this);
        }
      }, false);
    })
  };


  $.fn.doubleTap = function(opt) {
    var defaults = {
      time:300,
      func:function(o) {}
    };
    $.extend(defaults, opt);
    return this.each(function() {
      this.tap = {s:0,e:0};
      this.addEventListener('touchstart', function(event) {
        if(this.tap.s>0 && (parseFloat(new Date().getTime()) - parseFloat(this.tap.s)) < defaults.time){
          event.preventDefault();
          event.stopPropagation();
          defaults.func(this);
        }else
          this.tap.s = new Date().getTime();
      }, false);
    })
  };

})(jQuery);
