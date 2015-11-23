var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var idToObjKey = function(id){
    return 'tnt:o:id:' + id;
};

var Kv = function(context){
    this.context = context;
};

Kv.prototype.loadById = function(id, callback){
    var redis = this.context.redis.main;
    var key = idToObjKey(id);
    redis.hgetall(key, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to get tenant by id ' + id + ': ' + err,
            'Succeed to get tenant by id ' + id);

        if(result){
            result.administrative = result.administrative === 'true' ? true : false;
            //TODO: convert Date string
        }
        cbUtil.handleSingleValue(callback, err, result);
    });
};

Kv.prototype.saveById = function(json, callback){
    var redis = this.context.redis.main;
    var id = json.id;
    var key = idToObjKey(id);
    redis.hmset(key, json, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to save tenant by id ' + id + ': ' + err,
            'Succeed to save tenant by id ' + id);
        cbUtil.handleOk(callback, err, result, json);
    });
};

Kv = Promise.promisifyAll(Kv);

module.exports = Kv;