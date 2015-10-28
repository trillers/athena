/**
 * SPA definition which is the single entry of our mobile site
 */
var jquery = require('jquery');
jquery = require('../lib/jquery.cookie');
util = require('./util');
var page = require('./page');
///*
// * import global variables
// */
riot = require('seedriot');
nest = require('./nest');
$ = jquery;
require('./camera');
//require('./jssdk');
//console.log(wx);
domain = require('../domain/index');

/*
* wechat js config
*/
//var jsConfig = __page.jc;
//if(jsConfig){
//  wx.config(jsConfig);
//  wx.error(function(res){
//    console.log(res);
//  });
//}
//else{
//  console.error('no js config found');
//}
////
//var _czc = _czc || [];
//_czc.push(["_setAccount", "1254786218"]);

var agent = {
  init: function(){return this;}
};


//init agent window
(function($){
  //ajax event handlers
  function onStart(event) {
    //lock window handler
    util.forbidOperation();
  }
  function onComplete(event, xhr, settings) {
    //unlock window handler
    util.removeforbidOperation();
  }
  //ajax lock chain
  $(document).ajaxStart(onStart).ajaxComplete(onComplete);

  //jqlazyload.init($);

  //$("img").lazyload({ threshold : 200 ,effect:"fadeIn"});

  //util.setImageHeight($);

  $(window).resize(function(){
    //util.setImageHeight($);
  });

  $(".img_home").click(function(){
      $(".home_gy").removeClass("home_gy_set1");
      $(".home_gy").addClass("home_gy_set");
  });
  $(".home_close").click(function(){
      $(".home_gy").removeClass("home_gy_set");
      $(".home_gy").addClass("home_gy_set1");
  });

  window.newActivity = {};
  window.revokedActivity = {};
  riot.observable(window.newActivity);
  riot.observable(window.revokedActivity);
})(jquery);

module.exports = agent;