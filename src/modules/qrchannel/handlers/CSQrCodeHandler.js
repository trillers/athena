var qrHandler = require('../common/QrHandler');
var handler = new qrHandler(false, 'csr', null);
var path = require('path');
var assert = require('assert');
var wechatApi = require('../../wechat/common/api').api;
var request = require('request');
var fs = require('fs');
var logger = require('../../../app/logging').logger;

module.exports = function(emitter){
    emitter.message(function(event, context){
        var message = context.weixin.Content;
        var user = context.user;
        console.log('+++++++++++++');
        console.log(message);

        if(message.trim() === '客服二维码'){
            handler.autoCreate(null, function(err, qr){
                var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qr.ticket;
                var qrCodePath = '../../public/qrCode/' + user.wx_openid + '.png';
                request(url).pipe(fs.createWriteStream(path.join(__dirname, qrCodePath))).on('close', function () {
                    wechatApi.uploadImage(path.join(__dirname, qrCodePath), function (err, data) {
                        if(err){
                            return logger.err('uploadImage err: ' + err);
                        }
                        var mediaId = data.media_id;
                        wechatApi.sendImage(user.wx_openid, mediaId, function(err, data){
                            if(err){
                                return logger.err('get cs qrCode send image err:' + err);
                            }
                        });
                    });
                });
            });
        }
    });
};