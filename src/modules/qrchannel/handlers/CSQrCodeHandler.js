var qrHandler = require('../common/QrHandler');
var handler = new qrHandler(false, 'cs', null);
var path = require('path');
var assert = require('assert');
var wechatApi = require('../../wechat/common/api').api;
var request = require('request');
var fs = require('fs');
var logger = require('../../../app/logging').logger;

module.exports = function (message, userOpendid) {
    if (message.trim() === '客服二维码') {
        handler.autoCreate(null, function (err, qr) {
            var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qr.ticket;
            var qrCodePath = '../../../../public/qrCode/' + userOpendid + '.png';
            request(url).pipe(fs.createWriteStream(path.join(__dirname, qrCodePath))).on('close', function () {
                wechatApi.uploadMedia(path.join(__dirname, qrCodePath), 'image', function (err, data) {
                    if (err) {
                        return logger.error('uploadImage err: ' + err);
                    }
                    console.log(data);
                    var mediaId = data.media_id;
                    console.log(userOpendid);
                    console.log(mediaId);
                    wechatApi.sendImage(userOpendid, mediaId, function (err, data) {
                        if (err) {
                            return logger.error('get cs qrCode send image err:' + err);
                        }
                    });
                });
            });
        });
    }
};