var assert = require("assert");
var ConversationService = require('../../../../src/modules/conversation/services/ConversationService');
var ConversationState = require('../../../../src/modules/common/models/TypeRegistry').item('ConversationState');


/**
 * ConversationService unit test
 * **/
var initiator = new Date().getTime();

var cvs = {
    stt: ConversationState.Started.value()
    , initiator: initiator
    , csId: 'cs123'
    , cases: ['case1', 'case2']
    , createTime: new Date()
    , closeTime: new Date()
}

before(function (done) {
    setTimeout(function () {
        done();
    }, 4000);
});

describe('createConversation', function () {
    var cvsId = null;
    after(function (done) {
        ConversationService.deleteAsync(cvsId)
            .then(function(){
                done()
            })
            .catch(Error, function(err){
                console.log(err);
            });
    });

    it('success to create conversation', function (done) {
        ConversationService.create(cvs, function (err, data) {
            assert.ok(!err);
            assert.ok(data);
            cvsId = data._id;
            assert.equal(data.csId, cvs.csId);
            done();
        });
    });
});

describe('loadConversation', function () {
    var cvsId = null;
    before(function (done) {
        ConversationService.createAsync(cvs)
            .then(function (data) {
                cvsId = data._id;
                done();
            })
            .catch(Error, function (err) {
                console.log(err);
            })
    });

    after(function (done) {
        ConversationService.deleteAsync(cvsId)
            .then(function(){
                done()
            })
            .catch(Error, function(err){
                console.log(err);
            });
    });

    it('success to load conversation', function (done) {
        ConversationService.load(cvsId, function (err, data) {
            assert.ok(!err);
            assert.equal(data._id, cvsId);
            done();
        });
    });

});

describe('updateConversation', function () {
    var cvsId = null;
    before(function (done) {
        ConversationService.createAsync(cvs)
            .then(function (data) {
                cvsId = data._id;
                done();
            })
            .catch(Error, function (err) {
                console.log(err);
            })
    });

    after(function (done) {
        ConversationService.deleteAsync(cvsId)
            .then(function(){
                done()
            })
            .catch(Error, function(err){
                console.log(err);
            });
    });

    it('success to update conversation', function (done) {
        var update = {csId: 'cs456'};
        ConversationService.update(cvsId, update, function (err, data) {
            assert.ok(!err);
            assert.equal(data.csId, update.csId);
            done();
        });
    });

});

describe('updateConversationByCondition', function () {
    var cvsId = null;
    before(function (done) {
        ConversationService.createAsync(cvs)
            .then(function (data) {
                cvsId = data._id;
                done();
            })
            .catch(Error, function (err) {
                console.log(err);
            })
    });

    after(function (done) {
        ConversationService.deleteAsync(cvsId)
            .then(function(){
                done()
            })
            .catch(Error, function(err){
                console.log(err);
            });
    });

    it('success to update conversation by condition', function (done) {
        var update = {csId: 'cs789'};
        var condition = {
            _id: cvsId
        }
        ConversationService.updateByCondition(condition, update, function (err, data) {
            assert.ok(!err);
            assert.equal(data.csId, update.csId);
            done();
        });
    });
});

describe('findConversation', function () {
    var cvsId = null;
    var findInitiator = new Date().getTime();
    cvs.initiator = findInitiator;
    before(function (done) {
        ConversationService.createAsync(cvs)
            .then(function (data) {
                cvsId = data._id;
                done();
            })
            .catch(Error, function (err) {
                console.log(err);
            })
    });

    after(function (done) {
        ConversationService.deleteAsync(cvsId)
            .then(function(){
                done()
            })
            .catch(Error, function(err){
                console.log(err);
            });
    });

    var params = {
        conditions: {
            initiator: findInitiator
        },
        page: {
            no: 1,
            size: 2
        }
    }
    it('success to find conversation', function (done) {
        ConversationService.find(params, function (err, data) {
            assert.ok(!err);
            console.log(data);
            console.log(data.length);
            assert.equal(data.length, 1);
            done();
        });
    });
});

describe('filterConversation', function () {
    var cvsId = null;
    var filterInitiator = new Date().getTime();
    cvs.initiator = filterInitiator;
    before(function (done) {
        ConversationService.createAsync(cvs)
            .then(function (data) {
                cvsId = data._id;
                done();
            })
            .catch(Error, function (err) {
                console.log(err);
            })
    });

    after(function (done) {
        ConversationService.deleteAsync(cvsId)
            .then(function(){
                done()
            })
            .catch(Error, function(err){
                console.log(err);
            });
    });

    var params = {
        conditions: {
            initiator: filterInitiator
        },
        page: {
            no: 1,
            size: 2
        }
    }
    it('success to filter conversation', function (done) {
        ConversationService.filter(params, function (err, data) {
            assert.ok(!err);
            console.log(data.length);
            assert.equal(data.length, 1);
            done();
        });
    });
});

describe('delConversation', function () {
    var cvsId = null;
    before(function (done) {
        ConversationService.createAsync(cvs)
            .then(function (data) {
                cvsId = data._id;
                done();
            })
            .catch(Error, function (err) {
                console.log(err);
            })
    });

    it('success to del txt conversation', function (done) {
        ConversationService.delete(cvsId, function (err, data) {
            assert.ok(!err);
            done();
        });
    });

});