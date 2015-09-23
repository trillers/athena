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
        var qr = {
            _id: '8G',
            type: 'CS',
            scene_id: '50',
            ticket: 'gQFY8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL3YwaVNMNDNrR20xaml2QmVUR1JXAAIEKXqkVQMEAAAAAA==',
            views: 0,
            forever: true
        };
        var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGU8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL2VFaGlVcGZrNEcyWktEVXB2R1pXAAIE8BQCVgMEgDoJAA==';
        var imagePath = '../../public/qrcode/qrcode.png';
        console.log(path.join(__dirname, imagePath));
        request(url).pipe(fs.createWriteStream(path.join(__dirname, imagePath))).on('close', function () {
            wechatApi.uploadImage(path.join(__dirname, imagePath), function (err, data) {
                assert.ifError(err);
                done();
            });
        });

    });
});