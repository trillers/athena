var logger = require('../../../app/logging').logger;
var WechatLog = require('../models/WechatLog').model;
var Promise = require('bluebird');
var Service = {};

Service.logAction = function(msg, callback){
    var wechatLog = new WechatLog(msg);
    wechatLog.save(function (err, doc, numberAffected) {
        if (err) {
            logger.error('failed to save wechat logger :'+ err +' \r\n');
            if(callback) callback(err, null);
        }
        if (numberAffected) {
            logger.debug('Succeed to create wechat logger target \r\n');
            if(callback) callback(null, null);
        }
        else {
            logger.error('Fail to create wechat logger \r\n');
            if(callback) callback(new Error("wechat log action no affect result"), null);
        }
    });

};
var Service = Promise.promisifyAll(Service);
module.exports = Service;