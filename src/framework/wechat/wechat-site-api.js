var EventEmitter = require('events').EventEmitter;


/**
 * Wechat site is an api stub which developers can call
 * @constructor
 */
var WechatSiteApi = function(site){
    //this.emitter = new EventEmitter();
    this.site = site;
};


WechatSiteApi.prototype.createTmpQRCode = function(sceneId, expire, callback){
    var result = {
        "ticket":"gQG28DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0FuWC1DNmZuVEhvMVp4NDNMRnNRAAIEesLvUQMECAcAAA==",
        "expire_seconds":expire
    };
    this.site.tempSceneIds[sceneId] = Math.floor(new Date().getTime()/1000) + expire;

    if(callback) callback(null, result);
};

WechatSiteApi.prototype.createLimitQRCode = function(sceneId, callback){
    var result = {
        "ticket":"gQG28DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0FuWC1DNmZuVEhvMVp4NDNMRnNRAAIEesLvUQMECAcAAA=="
    };
    this.site.sceneIds[sceneId] = true;

    if(callback) callback(null, result);
};

WechatSiteApi.prototype.showQRCodeURL = function(ticket){
    return ''; //TODO
};

module.exports = WechatSiteApi;