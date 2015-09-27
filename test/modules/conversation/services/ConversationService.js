var assert = require("assert");
var ConversationService = require('../../../../src/modules/conversation/services/ConversationService');
var ConversationState = require('../../../../src/modules/common/models/TypeRegistry').item('ConversationState');


/**
 * ConversationService unit test
 * **/
var cvs = {
    stt: ConversationState.Started.value()
    , initiator: 'user123'
    , csId: 'cs123'
    , cases: ['case1', 'case2']
    , createTime: new Date()
    , closeTime: new Date()
}

var cvsId = null;

before(function(done){
    setTimeout(function(){
        done();
    },3000);
})


    describe('createConversation', function(){

        it('success to create conversation', function(done){
            ConversationService.create(cvs, function(err, data){
                assert.ok(!err);
                assert.ok(data);
                assert.ok(data._id);
                cvsId = data._id;
                assert.equal(data.csId, cvs.csId);
                done();
            });
        });
    });

    describe('loadConversation', function(){
        var cvsId = null;
        before();
        it('success to load conversation', function(done){
            ConversationService.load(cvsId, function(err, data){
                assert.ok(!err);
                assert.equal(data._id, cvsId);
                done();
            });
        });

    });

    describe('updateConversation', function(){

        it('success to update conversation', function(done){
            var update = {csId: 'cs456'};
            ConversationService.update(cvsId, update, function(err, data){
                assert.ok(!err);
                assert.equal(data.csId, update.csId);
                done();
            });
        });

    });

    describe('updateConversationByCondition', function(){

        it('success to update conversation by condition', function(done){
            var update = {csId: 'cs789'};
            var condition = {
                _id: cvsId
            }
            ConversationService.updateByCondition(condition, update, function(err, data){
                assert.ok(!err);
                assert.equal(data.csId, update.csId);
                done();
            });
        });
    });

    describe('findConversation', function(){
        var params = {
            condition:{
                initiator: 'user123'
            },
            page:{
                no: 1,
                size: 2
            }
        }
        it('success to find conversation', function(done){
            ConversationService.find(params, function(err, data){
                assert.ok(!err);
                console.log(data.length);
                assert.equal(1, data.length);
                done();
            });
        });
    });

    describe('filterConversation', function(){
        var params = {
            condition:{
                initiator: 'user123'
            },
            page:{
                no: 1,
                size: 2
            }
        }
        it('success to filter conversation', function(done){
            ConversationService.find(params, function(err, data){
                assert.ok(!err);
                console.log(data.length);
                assert.equal(1, data.length);
                done();
            });
        });
    });

    describe('delConversation', function(){

        it('success to del txt conversation', function(done){
            ConversationService.delete(cvsId, function(err, data){
                assert.ok(!err);
                done();
            });
        });

    });

