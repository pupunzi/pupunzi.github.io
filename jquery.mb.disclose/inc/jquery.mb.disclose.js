/*******************************************************************************
 * jQuery.mb.components: jquery.mb.CSSAnimate
 * version: 1.0- 04/12/11 - 18
 * © 2001 - 2011 Matteo Bicocchi (pupunzi), Open Lab
 *
 * Licences: MIT, GPL
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * email: mbicocchi@open-lab.com
 * site: http://pupunzi.com
 *
 *  params:

 @opt        -> the CSS object (ex: {top:300, left:400, ...})
 @duration   -> an int for the animation duration in milliseconds
 @ease       -> ease  ||  linear || ease-in || ease-out || ease-in-out  ||  cubic-bezier(<number>, <number>,  <number>,  <number>)
 @properties -> properties to which CSS3 transition should be applied.
 @callback   -> a callback function called once the transition end

 example:

 $(this).CSSAnimate({top: t, left:l, width:w, height:h}, 2000, "ease-out", "all", function() {el.anim();})
 ******************************************************************************/

$.fn.CSSAnimate=function(a,c,h,i,j,e){return this.each(function(){var d=$(this);if(0!==d.length&&a){"function"==typeof c&&(e=c);"function"==typeof h&&(e=h);"function"==typeof i&&(e=i);"function"==typeof j&&(e=j);if("string"==typeof c)for(var k in $.fx.speeds)if(c==k){c=$.fx.speeds[k];break}else c=null;c||(c=$.fx.speeds._default);i||(i="cubic-bezier(0.65,0.03,0.36,0.72)");j||(j="all");h||(h=0);if(jQuery.support.transition){var b="",f="transitionEnd";$.browser.webkit?(b="-webkit-",f="webkitTransitionEnd"): $.browser.mozilla?(b="-moz-",f="transitionend"):$.browser.opera?(b="-o-",f="oTransitionEnd"):$.browser.msie&&(b="-ms-",f="msTransitionEnd");for(var g in a)"transform"===g&&(a[b+"transform"]=a[g],delete a[g]),"transform-origin"===g&&(a[b+"transform-origin"]=a[g],delete a[g]);d.css(b+"transition-property",j);d.css(b+"transition-duration",c+"ms");d.css(b+"transition-delay",h+"ms");d.css(b+"transition-timing-function",i);setTimeout(function(){d.css(a)},1);var l=function(){d.get(0).removeEventListener(f, l,!1);d.css(b+"transition","");"function"==typeof e&&e()};d.get(0).addEventListener(f,l,!1)}else d.animate(a,c,e)}})};$.fn.CSSAnimateStop=function(){var a="";$.browser.webkit?a="-webkit-":$.browser.mozilla?a="-moz-":$.browser.opera?a="-o-":$.browser.msie&&(a="-ms-");$(this).css(a+"transition","")}; $.support.transition=function(){var a=(document.body||document.documentElement).style;return void 0!==a.transition||void 0!==a.WebkitTransition||void 0!==a.MozTransition||void 0!==a.MsTransition||void 0!==a.OTransition}();

/*******************************************************************************
 * jQuery.mb.components: jquery.mb.disclose
 * version: 1.0
 * © 2001 - 2012 Matteo Bicocchi (pupunzi), Open Lab
 *
 * Licences: MIT, GPL
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * email: mbicocchi@open-lab.com
 * site: http://pupunzi.com
 *
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
    version:"1.0",
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
      console.debug(banner.children().eq(0).data("onenter"))
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
        $el.CSSAnimate($elAnim, el.opt.outTimer, null, el.opt.ease, "all", function(){
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
        el.actualBanner.CSSAnimate({top:0, left:0, opacity:1, transform: "rotate(0deg) scale(1)" }, el.opt.inTimer,null, el.opt.ease, "all", function(){
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
          $el.CSSAnimate(cssEnd, time, cssDelay, el.opt.ease, "all", function(){});
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