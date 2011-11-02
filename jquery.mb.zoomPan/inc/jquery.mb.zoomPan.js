/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2011. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * jQuery.mb.components: jquery.mb.zoomPan
 * version: 1.0
 * © 2001 - 2011 Matteo Bicocchi (pupunzi), Open Lab
 */


(function($) {

    $.zoomPan={
        name:"mb.zoomPan",
        author:"Matteo Bicocchi",
        version:"1.0",

        defaults:{
            startScale:random(1,1.5),
            minScale:1,
            maxScale:2,
            cWidth:900,
            cHeight:900,
            velocity:[12000,14000],
            type:"linear",
            display:"block"
        },

        init:function(opt){
            return this.each(function(){

                var $el=$(this);
                var el=$el.get(0);
                el.opt=$.extend({},$.zoomPan.defaults,opt);


                $el.load(function(){

                    if(el.opt.isInit) return;

                    el.opt.isInit=true;

                    if($el.width()<el.opt.cWidth){
                        var ratio = el.opt.cWidth/$el.width();
                        $el.css({width:el.opt.cWidth,height: $el.height()*ratio});
                    }

                    el.opt.oWidth=$el.width();
                    el.opt.oHeight=$el.height();

                    el.opt.cWidth=el.opt.cWidth?el.opt.cWidth:el.opt.oWidth;
                    el.opt.cHeight=el.opt.cHeight?el.opt.cHeight:el.opt.oHeight;

                    el.opt.cWidth=$el.data("width")?$el.data("width"):el.opt.cWidth;
                    el.opt.cHeight=$el.data("height")?$el.data("height"):el.opt.cHeight;

                    el.opt.maxScale=el.opt.maxScale-el.opt.minScale;

                    $el.show().css({width:$el.width()*el.opt.startScale,height:$el.height()*el.opt.startScale, top:0, left:0});

                    var imgWrapper=$("<div/>").addClass("zoomPanWrapper").css({overflow:"hidden", width:el.opt.cWidth,height:el.opt.cHeight, position:"static", display:el.opt.display, margin:0});
                    $el.css({position:"static"}).wrap(imgWrapper);
                    $el.imagePanAnimate();

                }).attr("src",$el.attr("src")+"?_="+new Date().getTime()).css({opacity:0}).hide();
            })
        },

        animate:function(){
            var $el=this;
            var el=$el.get(0);

            var scale = random(el.opt.minScale , el.opt.maxScale);

            var w=Math.round(el.opt.oWidth*scale);
            var h=Math.round(el.opt.oHeight*scale);

            var ratio;
            if(w<el.opt.cWidth){
                ratio = el.opt.cWidth/w;
                w=el.opt.cWidth;
                h = h*ratio;
            }

            if(h<el.opt.cHeight){
                ratio = el.opt.cHeight/h;
                w=w*ratio;
                h = el.opt.cHeight;
            }

            var t= - random(h-el.opt.cHeight);
            var l= - random(w-el.opt.cWidth);
            var v= random(el.opt.velocity[0], el.opt.velocity[1]-el.opt.velocity[0]);

            $el.fadeTo(600,1,function(){$el.CSSAnimate({width:w, height:h, marginTop:t, marginLeft:l},v,el.opt.type,"margin-top, margin-left, width, height", function(){$el.imagePanAnimate()});});
        }
    };

    $.fn.CSSAnimate = function(opt, duration, type, properties, callback) {
        return this.each(function() {

            var el = $(this);

            if (el.length === 0 || !opt) {return;}

            if (typeof duration == "function") {callback = duration;}
            if (typeof type == "function") {callback = type;}
            if (typeof properties == "function") {callback = properties;}

            if (!duration) {duration = 1000;}
            if (!type) {type = "cubic-bezier(0.65,0.03,0.36,0.72)";}
            if (!properties) {properties = "all";}

            //http://cssglue.com/cubic
            //  ease  |  linear | ease-in | ease-out | ease-in-out  |  cubic-bezier(<number>, <number>,  <number>,  <number>)
            if (!jQuery.support.transition) {
                el.animate(opt, duration, callback);
                return;
            }

            var sfx = "";
            var transitionEnd = "TransitionEnd";
            if ($.browser.webkit) {
                sfx = "-webkit-";
                transitionEnd = "webkitTransitionEnd";
            } else if ($.browser.mozilla) {
                sfx = "-moz-";
                transitionEnd = "transitionend";
            } else if ($.browser.opera) {
                sfx = "-o-";
                transitionEnd = "oTransitionEnd";
            } else if ($.browser.msie) {
                sfx = "-ms-";
                transitionEnd = "msTransitionEnd";
            }

            el.css(sfx + "transition-property", properties);
            el.css(sfx + "transition-duration", duration + "ms");
            el.css(sfx + "transition-timing-function", type);

            setTimeout(function() {
                el.css(opt)
            }, 100);

            var endTransition = function() {
                el.css(sfx + "transition", "");
                if (typeof callback == "function") callback();
                el.get(0).removeEventListener(transitionEnd, endTransition, false);
            };
            el.get(0).addEventListener(transitionEnd, endTransition, false);

        })
    };

    $.fn.zoomPan=$.zoomPan.init;
    $.fn.imagePanAnimate=$.zoomPan.animate;

    function random(from, to){
        if(!to){
            to=from;
            from=0;
        }
        return from+Math.round(Math.random()*to);
    }

    // jQuery.support.transition
    // to verify that CSS3 transition is supported (or any of its browser-specific implementations)
    $.support.transition = (function(){
        var thisBody = document.body || document.documentElement,
            thisStyle = thisBody.style,
            support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
        return support;
    })();

})(jQuery);