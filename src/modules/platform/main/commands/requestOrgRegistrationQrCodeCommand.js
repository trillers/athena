var qrHandler = require('../../../qrchannel/common/QrHandler');
var handler = new qrHandler(false, 'ta', null);
var path = require('path');
var wechatApi = require('../../../wechat/common/api').api;
var request = require('request');
var fs = require('fs');
var os = require('os');

module.exports = function (context) {
    var openid = context.weixin.FromUserName;
    handler.autoCreate(null, function (err, qr) {
        var url = wechatApi.showQRCodeURL(qr.ticket);
        var qrCodePath = os.tmpdir() + openid + '.png';
        request(url).pipe(fs.createWriteStream(qrCodePath)).on('close', function () {
            wechatApi.uploadMedia(qrCodePath, 'image', function (err, data) {
                console.log('**********finish upload');
                if (err) {
                    return console.error('uploadImage err: ' + err);
                }
                var mediaId = data.media_id;
                wechatApi.sendImage(openid, mediaId, function (err, data) {
                    if (err) {
                        return console.error('get operator qrCode send image err:' + err);
                    }
                });
            });
        });
    });
};