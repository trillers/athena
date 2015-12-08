var qrHandler = require('../../../qrchannel/common/QrHandler');
var handler = new qrHandler(false, 'ta', null);
var path = require('path');
var wechatApi = require('../../../wechat/common/api').api;
var request = require('request');
var fs = require('fs');

module.exports = function (context) {
    var openid = context.weixin.FromUserName;
    handler.autoCreate(null, function (err, qr) {
        var url = wechatApi.showQRCodeURL(qr.ticket);
        var qrCodePath = '../../../../../public/qrCode/' + openid + '.png';
        request(url).pipe(fs.createWriteStream(path.join(__dirname, qrCodePath))).on('close', function () {
            wechatApi.uploadMedia(path.join(__dirname, qrCodePath), 'image', function (err, data) {
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