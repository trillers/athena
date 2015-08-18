var QrCodeKv = require('../kvs/QrCode');
var QrChannelService = require('../services/QrChannelService');
var wechat = require('../../wechat/common/api');
var Promise = require('bluebird');
var logger = require('../../../app/logging').logger;

var QrHandler = function(forever, type, handle){
    this.forever = forever;
    this.type = type;
    this.handle = handle;
};

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

QrHandler.prototype.create = function(sceneId, customId, callback){
    var createQrCode = this.forever ? createLimitQRCodeAsync : createTempQRCodeAsync;
    var qrChannel = {
        forever: this.forever,
        type: this.type,
        scene_id: sceneId,
        customId: customId
    };

     createQrCode(sceneId)
        .then(function (ticket) {
            qrChannel.ticket = ticket;
            var date = new Date();
            qrChannel.expire = new Date(date.getTime() + 7*24*60*60*1000);
            return qrChannel;
        }).then(function(qrChannel){
            QrChannelService.create(qrChannel, function (err, doc) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                if (callback) callback(null, doc);
            });
        });
};

QrHandler.prototype.autoCreate = function(customId, callback){
    var sceneIdFn = this.forever ? QrCodeKv.nextSceneId : QrCodeKv.nextTempSceneId;
    var me = this;
    sceneIdFn(function(err, sceneId){
        me.create(sceneId, customId, callback);
    });
}

QrHandler.prototype.manualCreate = function(sceneId, customId, callback){
    var me = this;
    QrChannelService.loadBySceneId(50, function(err, qr){
        if(err){
            logger.err('get teacher code err: ' + err);
            if(callback) callback(err);
            return;
        }

        if(qr){
            if(callback) callback(null, qr);
        }else{
            me.create(sceneId, customId, callback);
        }
    })
};

module.exports = QrHandler;

