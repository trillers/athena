var qrHandler = require('../../src/modules/qrchannel/common/QrHandler');
var handler = new qrHandler(false, 'cs', null);
var path = require('path');
var assert = require('assert');
var wechatApi = require('../../src/modules/wechat/common/api').api;
var request = require('request');
var fs = require('fs');

describe('create cs qr code', function () {
    before(function () {
        //console.log('bbbb');
        require('../../src/app/mongoose');
    });
    it('create', function (done) {
        //var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGU8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL2VFaGlVcGZrNEcyWktEVXB2R1pXAAIE8BQCVgMEgDoJAA==';
        var url = 'http://b.hiphotos.baidu.com/image/pic/item/faf2b2119313b07e73cdc2690ad7912397dd8c5b.jpg';
        request(url, function(err, res, body){
            var formData = {
                name: 'ddd.jpeg',
                buffer: body
            }
            request.post({url:'http://localhost:3020/api/file/upload', formData: formData}, function optionalCallback(err, res, body) {
                if (err) {
                    return console.error('upload failed:', err);
                    done();
                }
                console.log('Upload successful!  Server responded with:', body);
                done();
            });
        });

    });
});