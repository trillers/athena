var util = require('util');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');
var TenantKv = require('./Tenant');
var platformKey = function(){
    return 'plf:id';
};

var Kv = function(context){
    this.context = context;
};

util.inherits(Kv, TenantKv);

//Kv.prototype.getPlatformById = function(callback){
//    var redis = context.redis.main;
//    var key = platformKey();
//    var kv = this;
//    redis.get(key, function(err, result){
//        cbUtil.logCallback(
//            err,
//            'Fail to get platform id: ' + err,
//            'Succeed to get platform id: ' + result);
//        cbUtil.handleSingleValue(callback, err, result);
//
//        if(err){
//            if(callback) callback(err);
//            return;
//        }
//
//        if(result){
//            kv.loadById(result, callback);
//        }
//        else{
//            if(callback) callback();
//        }
//    });
//};

Kv.prototype.getPlatformId = function(callback){
    var redis = this.context.redis.main;
    var key = platformKey();
    redis.get(key, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to get platform id: ' + err,
            'Succeed to get platform id ' + result);
        cbUtil.handleSingleValue(callback, err, result);
    });
};

Kv.prototype.linkPlatformId = function(id, callback){
    var redis = this.context.redis.main;
    var key = platformKey();
    redis.set(key, id, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to link platform id ' + id + ': ' + err,
            'Succeed to link platform id ' + id);
        cbUtil.handleOk(callback, err, result);
    });
};


Kv = Promise.promisifyAll(Kv);

module.exports = Kv;