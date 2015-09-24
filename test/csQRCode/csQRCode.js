//var qrHandler = require('../../src/modules/qrchannel/common/QrHandler');
//var handler = new qrHandler(false, 'cs', null);
//var path = require('path');
//var assert = require('assert');
//var wechatApi = require('../../src/modules/wechat/common/api').api;
//var request = require('request');
//var fs = require('fs');
//
//describe('create cs qr code', function () {
//    before(function () {
//        //console.log('bbbb');
//        require('../../src/app/mongoose');
//    });
//    it('create', function (done) {
//        //var qr = {
//        //    _id: '8G',
//        //    type: 'CS',
//        //    scene_id: '50',
//        //    ticket: 'gQFY8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL3YwaVNMNDNrR20xaml2QmVUR1JXAAIEKXqkVQMEAAAAAA==',
//        //    views: 0,
//        //    forever: true
//        //};
//        var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGU8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL2VFaGlVcGZrNEcyWktEVXB2R1pXAAIE8BQCVgMEgDoJAA==';
//        var imagePath = '../../public/qrCode/qrcode.png';
//        //console.log(path.join(__dirname, imagePath));
//        //request(url).pipe(fs.createWriteStream(path.join(__dirname, imagePath))).on('close', function () {
//        //    wechatApi.uploadMedia(path.join(__dirname, imagePath), 'image', function (err, data) {
//        //        assert.ifError(err);
//        //        done();
//        //    });
//        //});
//        console.log(path.join(__dirname, imagePath));
//        var formData = {
//            file: {
//                value: fs.createReadStream(path.join(__dirname, imagePath)),
//                options: {
//                    filename: 'topsecret.jpg',
//                    contentType: 'image/jpg'
//                }
//            }
//            //myFile1: request(url)
//        }
//        request.post({url:'http://localhost:3020/api/file/upload', formData: formData}, function optionalCallback(err, res, body) {
//            if (err) {
//                return console.error('upload failed:', err);
//                done();
//            }
//            console.log('Upload successful!  Server responded with:', body);
//            done();
//        });
//        //request()
//        //    .post('http://localhost:3020/api/file/upload')
//        //    .type('form')
//        //    .attach('myFile', path.join(__dirname, imagePath))
//        //    .field('name', 'ddddd')
//        //    .end(function(err, res){
//        //        console.log(res);
//        //        done();
//        //    });
//        //fs.createReadStream(path.join(__dirname, imagePath)).pipe(request.put('http://localhost:3020/api/file/upload')).on('end', function(){
//        //    console.log('end');
//        //    done();
//        //})
//    });
//});