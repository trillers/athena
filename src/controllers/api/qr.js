var QrChannel = require('../../modules/qrchannel');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

module.exports = function(router){
    //getTeacher QR CODE
    router.get('/getCSQrCode', function(req, res){
        var key = QrChannel.genKey(true, 'CS');
        var handler = QrChannel.handlers[key];
        handler.manualCreate(50, null, function(err, qr){
            //TODO err handler
            var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qr.ticket;
            res.redirect(url);
        })
    });

    router.get('/getSMQrCode', function(req, res){
        var key = QrChannel.genKey(true, 'SM');
        var handler = QrChannel.handlers[key];
        handler.manualCreate(50, null, function(err, qr){
            //TODO err handler
            var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qr.ticket;
            res.redirect(url);
        })
    });
};