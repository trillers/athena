var QrChannel = require('../../modules/qrchannel');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var Promise = require('bluebird');

module.exports = function(router){
    //get customer server QR CODE
    router.get('/getCSQrCode', function* (){
        var key = QrChannel.genKey(true, 'CS');
        var handler = QrChannel.handlers[key];
        var createQrCode = Promise.promisify(handler.manualCreate);
        var qr = yield createQrCode(50, null);
        var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qr.ticket;
        this.redirect(url);
    });

    //get system manager qr code
    router.get('/getSMQrCode', function* (){
        var key = QrChannel.genKey(true, 'SM');
        var handler = QrChannel.handlers[key];
        var createQrCode = Promise.promisify(handler.manualCreate);
        var qr = yield createQrCode(51, null);
        var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qr.ticket;
        this.redirect(url);
    });
};