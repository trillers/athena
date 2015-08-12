var logger = require('../../../app/logging').logger;
var WechatLog = require('../models/WechatLog').model;
var Service = {};

Service.logAction = function(msg, user, callback){
    var wechatLog = new WechatLog(msg);
    wechatLog.save(function (err, doc, numberAffected) {
        if (err) {
            logger.error('failed to save wechat logger :'+ err +' \r\n');
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create wechat logger target \r\n');
        }
        else {
            logger.error('Fail to create wechat logger \r\n');
        }
    });

};

module.exports = Service;