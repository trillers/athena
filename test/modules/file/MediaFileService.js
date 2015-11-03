/**
 * file module save media file test
 */
var assert = require('chai').assert;
var service = require('../../../src/modules/file/services/MediaFileService');
var co = require('co');
var wechatApi = require('../../../src/modules/wechat/common/api').api;
before(function(done){
    require('../../../src/app/mongoose');
    done();
});
describe('save image media file', function(){
    var media_id = '';
    before(function (done) {
        wechatApi.uploadMedia(__dirname + '/test.png', 'image', function (err, result) {
            assert.ok(!err);
            media_id = result.media_id;
            done();
        })
    });

    it('success save image media file', function(done){
        co(function*(){
            var result = yield service.saveImage(media_id);
            assert.ok(result);
            console.log(result);
            done();
        });
    });
})

describe('save voice media file', function(){
    var media_id = '';
    before(function (done) {
        wechatApi.uploadMedia(__dirname + '/test.amr', 'voice', function (err, result) {
            assert.ok(!err);
            media_id = result.media_id;
            done();
        })
    });

    it('success save voice media file', function(done){
        co(function*(){
            var result = yield service.saveVoice(media_id);
            assert.ok(result);
            console.log(result);
            done();
        });
    });
})