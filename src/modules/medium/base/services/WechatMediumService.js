var assert = require('assert');
var logger = require('../../../../app/logging').logger;
var cbUtil = require('../../../../framework/callback');

var Service = function(context){
    assert.ok(this.redis = context.redis.main, 'no redis main client');
    assert.ok(this.WechatMedium = context.models.WechatMedium, 'no Model WechatMedium');
};

Service.prototype.create = function(mediumJson, callback){
    var medium = new this.WechatMedium(mediumJson);
    medium.save(function (err, result, affected) {
        //TODO: need logging
        cbUtil.handleAffected(callback, err, result, affected);
    });

};

module.exports = Service;