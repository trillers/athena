//var EventEmitter = require('events').EventEmitter;
//var WechatSite = require('./wechat-site');

/**
 * Wechat site is a 订阅号/服务号 server which can interact with wechat user's client
 * @constructor
 */
var CommandRegistry = function(){
    //this.emitter = new EventEmitter();
    this.idOpenids = {};
};

CommandRegistry.prototype.add = function(cmdPattern, cmdHandler){
};

module.exports = CommandRegistry;