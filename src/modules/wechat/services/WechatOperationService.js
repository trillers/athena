var logger = require('../../../app/logging').logger;
var WechatLog = require('../models/WechatLog').model;
var Promise = require('bluebird');
var Service = {};

Service.logAction = function(msg, user, callback){
    var wechatLog = new WechatLog(msg);
    wechatLog.save(function (err, doc, numberAffected) {
        if (err) {
            logger.error('failed to save wechat logger :'+ err +' \r\n');
            return callback(err, null);
        }
        if (numberAffected) {
            logger.debug('Succeed to create wechat logger target \r\n');
            return callback(null, null);
        }
        else {
            logger.error('Fail to create wechat logger \r\n');
            return callback(new Error("wechat log action no affect result"), null);
        }
    });

};
var Service = Promise.promisifyAll(Service);
module.exports = Service;