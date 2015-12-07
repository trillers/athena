var util = require('util');
var Promise = require('bluebird');
var cbUtil = require('../../../../framework/callback');
var WechatMediumKv = require('../../../medium/base/kvs/WechatMedium');

var platformKey = function(){
    return 'plf:mdm:id';
};

var Kv = function(context){
    this.context = context;
};

util.inherits(Kv, WechatMediumKv);

Kv.prototype.getPlatformWechatSiteId = function(callback){
    var redis = this.context.redis.main;
    var key = platformKey();
    redis.get(key, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to get platform wechat siteid: ' + err,
            'Succeed to get platform wechat site id ' + result);
        cbUtil.handleSingleValue(callback, err, result);
    });
};

Kv.prototype.setPlatformWechatSiteId = function(id, callback){
    var redis = this.context.redis.main;
    var key = platformKey();
    redis.set(key, id, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to set platform wechat siteid ' + id + ': ' + err,
            'Succeed to set platform wechat site id ' + id);
        cbUtil.handleOk(callback, err, result);
    });
};


Kv = Promise.promisifyAll(Kv);

module.exports = Kv;