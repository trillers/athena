var logger = require('../../../app/logging').logger;
var QrChannel = require('../models/QrChannel').model;
var wechat = require('../../wechat/common/api');

var u = require('../../../app/util');
var Promise = require('bluebird');
var Service = {};

var createLimitQRCode = function(sceneId, callback){
    wechat.api.createLimitQRCode(sceneId, function(err, result){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, result.ticket);
        }
    });
};

var createTempQRCode = function(sceneId, callback){
    wechat.api.createTmpQRCode(sceneId, 604800, function(err, result){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, result.ticket);
        }
    });
};

var createLimitQRCodeAsync = Promise.promisify(createLimitQRCode);
var createTempQRCodeAsync = Promise.promisify(createTempQRCode);

Service.create = function(json, callback){
    var qrChannel = new QrChannel(json);
    qrChannel.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create qrChannel: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create qrChannel: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create qrChannel'));
        }
    });
}

Service.createQrCode = function(forever, type, sceneId, customId){
    var createQrCode = this.forever ? createLimitQRCodeAsync : createTempQRCodeAsync;
    var qrChannel = new QrChannel({
        forever: forever,
        type: type,
        customId: customId
    });

    createQrCode(sceneId)
        .then(function(ticket){
            qrChannel.ticket = ticket;
            qrChannel.save(function (err, doc, numberAffected) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                if (numberAffected) {
                    logger.debug('Succeed to create teacher qrcode: ' + require('util').inspect(doc) + '\r\n');
                    if (callback) callback(null, doc);
                }
                else {
                    logger.error('Fail to create teacher qrcode: ' + require('util').inspect(doc) + '\r\n');
                    if (callback) callback(new Error('Fail to create teacher qrcode'));
                }
            });
        })
}

Service.loadBySceneId = function (sceneId, callback) {
    QrChannel.findOneAndUpdate({scene_id: sceneId}, {$inc: {'view': 1}}, function(err, doc){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, doc);
        }
        //TODO: update to increase views by one
    });
}

Service = Promise.promisifyAll(Service);

module.exports = Service;


