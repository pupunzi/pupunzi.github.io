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
            startScale:random(.5),
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

                $el.css({opacity:0});
                $el.load(function(){

                    //todo: Add height conditioning
                    //first verify width and height, than add css
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

                    $el.css({width:$el.width()*el.opt.startScale,height:$el.height()*el.opt.startScale, top:0, left:0});



                    var imgWrapper=$("<div/>").css({overflow:"hidden", width:el.opt.cWidth,height:el.opt.cHeight, position:"relative", display:el.opt.display, margin:0});
                    $el.css({position:"absolute"}).wrap(imgWrapper);

                    $el.imagePanAnimate();
                })
            })
        },
        animate:function(){
            var $el=this;
            var el=$el.get(0);

            var scale = el.opt.minScale + (Math.random() * el.opt.maxScale);

            var w=Math.round(el.opt.oWidth*scale);
            var h=Math.round(el.opt.oHeight*scale);

            //todo: Add height conditioning
            //first verify width and height, than add css
            
            if(w<el.opt.cWidth){
                var ratio = el.opt.cWidth/w;
                w=el.opt.cWidth;
                h = h*ratio;
            }

            var t= - Math.random()*((h-el.opt.cHeight));
            var l= - Math.random()*((w-el.opt.cWidth));
            var v= el.opt.velocity[0]+Math.random()*(el.opt.velocity[1]-el.opt.velocity[0]);

            $el.fadeTo(600,1,function(){$el.CSSAnimate({width:w, height:h, top:t, left:l},v,el.opt.type,function(){$el.imagePanAnimate()});});

        }
    };

    $.fn.CSSAnimate=function(opt, duration, type, callback){

        //console.debug(opt);

        if(!opt) return;

        if(typeof duration=="function"){
            callback=duration;
        }
        if(typeof type=="function"){
            callback=type;
        }
        if(!duration)
            duration=1000;

        if(!type)
            type="cubic-bezier(0.65,0.03,0.36,0.72)";

        //http://cssglue.com/cubic
        //	ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier(<number>, <number>, <number>, <number>)

        var el=this;

        if($.browser.msie){
            el.animate(opt,duration,callback);
            return;
        }

        var sfx="";
        var transitionEnd = "TransitionEnd";
        if ($.browser.webkit) {
            sfx="-webkit-";
            transitionEnd = "webkitTransitionEnd";
        } else if ($.browser.mozilla) {
            sfx="-moz-";
            transitionEnd = "transitionend";
        } else if ($.browser.opera) {
            sfx="-o-";
            transitionEnd = "oTransitionEnd";
        }

        el.css(sfx+"transition-property","all");
        el.css(sfx+"transition-duration",duration+"ms");
        el.css(sfx+"transition-timing-function",type);

        el.css(opt);

        var endTransition = function(){
            el.css(sfx+"transition","");
            if(typeof callback=="function")
                callback();
            el.get(0).removeEventListener(transitionEnd,endTransition,true);
        };
        el.get(0).addEventListener(transitionEnd, endTransition, true);
    };


    $.fn.zoomPan=$.zoomPan.init;
    $.fn.imagePanAnimate=$.zoomPan.animate;

})(jQuery);

function random(val){
    return 1+Math.round(Math.random()*val);
}