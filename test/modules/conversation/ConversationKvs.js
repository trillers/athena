var assert = require("assert");
var cskv = require('../../../src/modules/conversation/kvs/Conversation');

/**
 * Conversation kvs test
 * **/
describe('Conversation', function(){
    var csId = 'ABC7', userId = 'rrrrrrrr', cvsId = 'ak34',
        cvs = {_id: cvsId, stt: 'st', initiator: userId, csId: csId, createTime: new Date()};

    it('create', function(done){
        cskv.create(cvs, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, cvs);
            done();
        });
    });

    it('loadById', function(done){
        cskv.loadById(cvsId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data._id, cvs._id);
            done();
        });
    });


    it('delById', function(done){
        cskv.delById(cvsId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });

    it('setCurrentId', function(done){
        cskv.setCurrentId(userId, cvsId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, cvsId);
            done();
        });
    });

    it('getCurrentId', function(done){
        cskv.getCurrentId(userId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, cvsId);
            done();
        });
    });

    it('delCurrentId', function(done){
        cskv.delCurrentId(userId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });

});