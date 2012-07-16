/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2012. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 *
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
 */
$.fn.CSSAnimate=function(a,b,h,i,e){return this.each(function(){var d=$(this);if(0!==d.length&&a){"function"==typeof b&&(e=b);"function"==typeof h&&(e=h);"function"==typeof i&&(e=i);if("string"==typeof b)for(var j in $.fx.speeds)if(b==j){b=$.fx.speeds[j];break}else b=null;b||(b=$.fx.speeds._default);h||(h="cubic-bezier(0.65,0.03,0.36,0.72)");i||(i="all");if(jQuery.support.transition){var c="",f="transitionEnd";$.browser.webkit?(c="-webkit-",f="webkitTransitionEnd"):$.browser.mozilla?(c="-moz-",f= "transitionend"):$.browser.opera?(c="-o-",f="oTransitionEnd"):$.browser.msie&&(c="-ms-",f="msTransitionEnd");for(var g in a)"transform"===g&&(a[c+"transform"]=a[g],delete a[g]),"transform-origin"===g&&(a[c+"transform-origin"]=a[g],delete a[g]);d.css(c+"transition-property",i);d.css(c+"transition-duration",b+"ms");d.css(c+"transition-timing-function",h);setTimeout(function(){d.css(a)},0);var k=function(){d.get(0).removeEventListener(f,k,!1);d.css(c+"transition","");"function"==typeof e&&e()};d.get(0).addEventListener(f, k,!1)}else d.animate(a,b,e)}})};$.fn.CSSAnimateStop=function(){var a="";$.browser.webkit?a="-webkit-":$.browser.mozilla?a="-moz-":$.browser.opera?a="-o-":$.browser.msie&&(a="-ms-");$(this).css(a+"transition","")};$.support.transition=function(){var a=(document.body||document.documentElement).style;return void 0!==a.transition||void 0!==a.WebkitTransition||void 0!==a.MozTransition||void 0!==a.MsTransition||void 0!==a.OTransition}();

/*
 *
 * jQuery.mb.components: jquery.mb.momentumSlide
 * version: 1.0- 04/2/2 - 18
 * © 2001 - 2012 Matteo Bicocchi (pupunzi), Open Lab
 *
 * Licences: MIT, GPL
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * email: mbicocchi@open-lab.com
 * site: http://pupunzi.com
 */

(function($){

  $.mbMomentumSlide = {
    name:"mb.momentumSlide",
    author:"Matteo Bicocchi",
    version:"1.0",
    defaults:{
      duration:600,
      direction:"h",
      waitBefore:100,
      propagate:true,
      anchor:0,
      pagination:5,
      activateKeyboard:true,
      indexPlaceHolder:null,
      onInit:function(el){},
      onStart:function(el){},
      onDrag:function(el){},
      onBeforeEnd:function(el){},
      onEnd:function(el){},
      onBounceStart:function(el){},
      onBounceEnd:function(el){},
      onGoTo: function(el){}
    },

    init: function(opt){

      var ua = navigator.userAgent.toLowerCase();
      var isiOs = ua.match(/(iphone|ipod|ipad)/);

      var hasTouch = 'ontouchstart' in window;
      var events={};
      events.start = hasTouch ? "touchstart" : "mousedown";
      events.move = hasTouch ? "touchmove" : "mousemove";
      events.end = hasTouch ? "touchend" : "mouseup";
      events.windowResize = hasTouch && isiOs ? "orientationchange" : "resize";

      var arg = arguments;

      this.each(function(){

        var el= this;
        var $el= $(this);

        $el.addClass(".mbMomentumSlider");

        if(typeof arg[0] == "string"){
          switch(arg[0]){
            case "goto":
              $.mbMomentumSlide.goTo(el, arg[1]);
              break;
            case "next":
              $.mbMomentumSlide.next(el);
              break;
            case "prev":
              $.mbMomentumSlide.prev(el);
              break;
            case "refresh":
              $.mbMomentumSlide.refresh(el);
              break;
            case "end":
              $.mbMomentumSlide.end(el);
              break;
          }
          return;
        }

        $el.addClass("cursorGrab");

        el.opt = {};
        el.margin={};
        el.isDevice = hasTouch;
        el.cancelScroll=false;
        el.scrolled=false;
        el.hasTouch=hasTouch;
        el.page=0;

        el.bounceStartCalled=false;
        el.bounceEndCalled=false;

        el.opt.id = el.id ? el.id : "moms_"+ new Date().getTime();
        $.extend (el.opt, $.mbMomentumSlide.defaults,opt);

        $('img', $el).bind('dragstart.mbMomentum_'+el.opt.id, function(event){event.preventDefault();});

        var wrapper= $("<div/>").addClass("mbScrollWrapper_"+el.opt.id).css({position:"relative", lineHeight:0, margin:0});
        $el.wrapInner(wrapper);
        $el.css({overflow:"hidden"});

        el.container=$(".mbScrollWrapper_"+el.opt.id,$el);
        var containeCss= el.opt.direction == "h" ? {height:"100%", display:"inline"} : {width:"100%"};
        el.container.css(containeCss);

        el.pages = $(el.container).children();

        el.pages.each(function(i){
          var wrapper = $("<div/>").addClass("pageContent");
          $(this).wrapInner(wrapper);

          var css = el.opt.direction == "h" ? {display:"inline-block", width:$el.outerWidth()} : {display:"block", height:$el.outerHeight()};
          $(this).css(css).attr("data-idx",i);
          el.container.append($(this));
          this.content = $(".pageContent",$(this)).get(0);
        });

        el.w=el.container.outerWidth(true) - el.pages.outerWidth();
        el.h=el.container.outerHeight(true) - el.pages.outerHeight();

        $el.unbind(events.start+".mbMomentum_"+el.opt.id).bind(events.start+".mbMomentum_"+el.opt.id,function(e){$.mbMomentumSlide.start(e,el);});
        $el.unbind(events.move+".mbMomentum_"+el.opt.id).bind(events.move+".mbMomentum_"+el.opt.id, function(e){$.mbMomentumSlide.move(e,el);});
        $(document).unbind(events.end+".mbMomentum_"+el.opt.id).bind(events.end+".mbMomentum_"+el.opt.id, function(){$.mbMomentumSlide.end(el);});

        $(window).unbind(events.windowResize+".mbMomentum_"+el.opt.id).bind(events.windowResize+".mbMomentum_"+el.opt.id, function(){
          $.mbMomentumSlide.refresh(el);
        });

        if(el.opt.activateKeyboard)
          $(document).bind("keydown."+el.opt.id, function(e){
            var key= e.which;

            if(key==37){
              $.mbMomentumSlide.prev(el);
            }
            if(key==39){
              $.mbMomentumSlide.next(el);
            }
          });

        if($(el.opt.indexPlaceHolder).length>0){
          $.mbMomentumSlide.buildIndex(el);
        }

        if(typeof el.opt.onInit === "function")
          el.opt.onInit(el);

        $el.bind("goto."+".mbMomentum_"+el.opt.id,function(e){
          if(typeof el.opt.onGoTo === "function")
            el.opt.onGoTo(el);
        });


        $.mbMomentumSlide.goTo(el,1);

      })
    },

    start:function(e,el){
      var $el = $(el);
      el.container.CSSAnimateStop();

      el.bounceStartCalled=false;
      el.bounceEndCalled=false;
      el.anchored=true;

      var event= e;
      if(el.hasTouch){
        e = e.originalEvent;
        e = e.touches[0];
      }

      $("body").unselectable();

      el.timer = setTimeout(function() {
        el.canScroll=true;
        $(el).addClass("cursorGrabbing");

      },el.opt.waitBefore);

      el.startX= e.clientX;
      el.startY= e.clientY;

      el.startPosX= parseFloat(el.container.css("margin-left"));
      el.startPosY= parseFloat(el.container.css("margin-top"));

      el.w=el.container.outerWidth() - $el.outerWidth();
      el.h=el.container.outerHeight() - $el.outerHeight();

      $.mbMomentumSlide.refresh(el);

      if(typeof el.opt.onStart == "function")
        el.opt.onStart(el);

      if(!el.opt.propagate)
        event.stopPropagation();

    },

    move:function(e,el){

      var margin= el.opt.direction == "h" ? parseFloat(el.container.css("margin-left")) : parseFloat(el.container.css("margin-top"));
      var event= e;
      if(el.hasTouch){
        e = e.originalEvent;
        e = e.touches[0];
      }
      event.preventDefault();

      el.x = el.endX = e.clientX;
      el.y = el.endY = e.clientY;

      /*Check if the scrolling direction is the same of the component, otherwise user is doing something else*/
      el.locked = false;
      if(el.opt.direction == "h"){
        el.locked = Math.abs(el.startY - el.endY) > Math.abs(el.startX - el.endX)+50;
      }else if(el.opt.direction == "v"){
        el.locked = Math.abs(el.startX - el.endX) > Math.abs(el.startY - el.endY)+50;
      }

      if(el.canScroll && ! el.locked){
        el.scrolling=true;

        var condition = el.opt.direction == "h" ? Math.abs(el.startY - el.endY) : Math.abs(el.startX - el.endX);

        var dim = el.opt.direction == "h" ? el.w : el.h;

        var friction = margin>=0 || margin <= -dim ? 6:1;
        var x = Math.floor(el.startX-e.clientX) / friction;
        var y= Math.floor(el.startY-e.clientY) / friction;

        if(margin>10 && !el.bounceStartCalled){
          if(typeof el.opt.onBounceStart == "function"){
            el.opt.onBounceStart(el);
            el.bounceStartCalled=true;
          }
        }else if(margin < -(dim+10) && !el.bounceEndCalled){
          if(typeof el.opt.onBounceEnd === "function"){
            el.opt.onBounceEnd(el);
            el.bounceEndCalled=true;
          }
        }else if(condition<el.opt.anchor && el.anchored){
          event.stopPropagation();
        }else{
          el.anchored=false;
        }

        var dir = el.opt.direction == "h" ? (x<0 ? "left" : "right") :(y<0 ? "top" :"bottom");

        var css = el.opt.direction == "h" ? {"margin-left": el.startPosX-x} : {"margin-top": el.startPosY-y};
        el.container.css(css);
        if(typeof el.opt.onDrag == "function")
          el.opt.onDrag(el, dir);

      }else if(el.locked){
        $(el).momentumSlide("end");
      }

    },

    end:function(el){

      var $el = $(el);
      clearTimeout(el.timer);
      el.canScroll=false;
      $el.removeClass("cursorGrabbing");

      if (!el.scrolling)
        return;

      el.scrolling=false;

      el.pageW = $el.outerWidth();
      el.pageH = $el.outerHeight();
      el.changePoint =  el.opt.direction == "h" ? el.pageW/2 : el.pageH/2;

      var checkPageX = Math.abs(el.startX-el.endX)>el.changePoint && parseFloat(el.container.css("margin-left"))<0 && el.pages.eq(el.page).length>0;
      var checkPageY = Math.abs(el.startY-el.endY)>el.changePoint && parseFloat(el.container.css("margin-top"))<0 && el.pages.eq(el.page).length>0;

      var changePage= el.opt.direction == "h" ? checkPageX : checkPageY;

      var oldPage = el.page;

      if(changePage){
        var canMove = el.opt.direction == "h" ? el.endX<el.startX : el.endY<el.startY;

        if(canMove){
          if(el.pages.eq(el.page+1).length>0)
            el.page++;
        }else{
          if(el.pages.eq(el.page-1).length>0)
            el.page--;
        }
      }

      if(el.page != oldPage)
        el.oldPage = oldPage;

      $.mbMomentumSlide.goTo(el,el.page+1);
      el.anchored=false;
    },

    refresh:function(el){

      if(!el.opt)
        return;

      var $el = $(el);
      el.pages = $(el.container).children();
      el.pages.each(function(){
        var css = el.opt.direction == "h" ? {width:$el.outerWidth()} : {height:$el.outerHeight()};
        $(this).css(css);
      });
      var css = el.opt.direction == "h" ? {marginLeft:-($el.outerWidth()*el.page), width:$el.outerWidth()*el.pages.length} : {marginTop:-($el.outerHeight()*el.page), height:$el.outerHeight()*el.pages.length};
      el.container.css(css);
    },

    next:function(el){

      el.oldPage = el.page;

      if(typeof el.opt.onDrag == "function")
        el.opt.onDrag(el,"right");

      if(el.page < el.pages.length-1)
        el.page++;

      $.mbMomentumSlide.goTo(el,el.page+1);
    },

    prev:function(el){

      el.oldPage = el.page;

      if(typeof el.opt.onDrag == "function")
        el.opt.onDrag(el,"left");

      if(el.page > 0)
        el.page--;

      $.mbMomentumSlide.goTo(el,el.page+1);
    },

    goTo:function(el,idx,animate){

      if(animate === undefined)
        animate = true;

      var $el = $(el);
      idx = idx-1;
      if(idx>=0 && idx< el.pages.length)
        el.page=idx;
      else
        el.page=0;

      el.actualPage = el.pages[el.page];

      var event = $.Event("goto");
      event.el = el;
      $(el).trigger(event);

      //$(el.actualPage).find("article:first").not(":visible").fadeIn(1000);

      var pos= el.opt.direction == "h" ? -($el.outerWidth()*el.page) : -($el.outerHeight()*el.page);
      var css = el.opt.direction == "h" ? {marginLeft:pos} : {marginTop:pos};

      var ease = "cubic-bezier(0,.98,.26,.97)";

      if(typeof el.opt.onBeforeEnd == "function")
        el.opt.onBeforeEnd(el);

      var duration = animate?el.opt.duration:1;

      el.container.CSSAnimate(css,duration, ease, "all", function(){

        if(typeof el.opt.onEnd == "function")
          el.opt.onEnd(el);

        //$("body").clearUnselectable();
        el.locked=false;

      });
      if($(el.opt.indexPlaceHolder).length>0){
        $.mbMomentumSlide.buildIndex(el);
      }
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
          $.mbMomentumSlide.goTo(el,$(this).data("idx")+1);
        });
        idxContainer.append(indexEl);
      }
      $(".idxPage",indexBox).eq(el.page).addClass("sel");
    },

    getNextPage:function(el){
      var page = el.pages.eq(el.page+1);
      return page;
    },

    getPrevPage:function(el){
      var page = el.pages.eq(el.page-1);
      return page;
    }

  };

  $.fn.momentumSlide = $.mbMomentumSlide.init;

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

})(jQuery);