
/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.enterFrame.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matbicoc@gmail.com
 *  site: 	https://pupunzi.com
 *  blog:	https://pupunzi.open-lab.com
 * 	https://open-lab.com
 *
 *  Licences: MIT, GPL
 *  https://www.opensource.org/licenses/mit-license.php
 *  https://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 07/01/14 22.50
 *  *****************************************************************************
 */

$.enterFrame = {
  triggers:[],
  timing: {
    refreshTick: 1000 / 60
  },
  init:function(){
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, $.enterFrame.timing.refreshTick - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };

    $.enterFrame.coreLoopId=requestAnimationFrame($.enterFrame.coreLoop);
  },
  /**
   *
   * @param eventname
   * @param start
   * @param frequency in milliseconds 1000 = 1 sec. This may be delayed by requestAnimationFrame DOm resync
   * @param mainFunction
   * @param data
   * @constructor
   */
  GTrigger: function(eventname, start, frequency, mainFunction, data) {
    this.eventname = eventname;
    this.start = start;
    this.frequency = frequency;
    this.suspended = false;
    $.enterFrame.triggers.push(this);
    if (mainFunction != null) {
      $(document).on(eventname, data, mainFunction);
    }
  },

  getGTriggerByEventName: function(eventname) {
    for (var gi in $.enterFrame.triggers) {
      if ($.enterFrame.triggers[gi].eventname == eventname) {
        return $.enterFrame.triggers[gi];
      }
    }
  },

  coreLoop: function(timeStamp) {
    $.enterFrame.coreLoopId=requestAnimationFrame($.enterFrame.coreLoop);
    $.enterFrame.render(timeStamp);
  },

  render: function(timeStamp) {
    for (var ti in $.enterFrame.triggers) {
      var gtrigger = $.enterFrame.triggers[ti];
      gtrigger.start = (gtrigger.start + $.enterFrame.timing.refreshTick);
      if ((gtrigger.start >= (gtrigger.frequency - ($.enterFrame.timing.refreshTick/2)) ) && gtrigger.suspended == false) {

        $(document).trigger(gtrigger.eventname);
        gtrigger.start = 0;

        //sample of event specific
        var event = $.Event("refreshGameState");
        event.eventData ={some:new Date().getTime()};
        $(document).trigger(event);
      }
    }
  }
};
