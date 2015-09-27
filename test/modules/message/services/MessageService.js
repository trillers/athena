var assert = require("assert");
var MessageService = require('../../../../src/modules/message/services/MessageService');
var MsgContentType = require('../../../../src/modules/common/models/TypeRegistry').item('MsgContent');

/**
 * MessageService unit test
 * **/

var txtMsgId, mediaMsgId, channel = new Date().getTime();
var txtMsg = {
    from: 'adc453',
    to: null,
    channel: channel,
    contentType: MsgContentType.text.value(),
    content: 'test message',
    mediaId: null
}

var mediaMsg = {
    from: 'adc453',
    to: null,
    channel: channel,
    contentType: MsgContentType.image.value(),
    content: null,
    mediaId: 'media123'
}

before(function (done) {
    setTimeout(function () {
        done();
    }, 4000);
});

describe('createMessage', function () {

    it('success to create txt message', function (done) {
        MessageService.create(txtMsg, function (err, data) {
            assert.ok(!err);
            assert.ok(data);
            assert.ok(data._id);
            txtMsgId = data._id;
            assert.equal(data.content, txtMsg.content);
            done();
        });
    });

    it('success to create media message', function (done) {
        MessageService.create(mediaMsg, function (err, data) {
            assert.ok(!err);
            assert.ok(data);
            assert.ok(data._id);
            mediaMsgId = data._id;
            assert.equal(data.mediaId, mediaMsg.mediaId);
            done();
        });
    });
});

describe('loadMessage', function () {

    it('success to load txt message', function (done) {
        MessageService.load(txtMsgId, function (err, data) {
            assert.ok(!err);
            assert.equal(data._id, txtMsgId);
            done();
        });
    });

    it('success to load media message', function (done) {
        MessageService.load(mediaMsgId, function (err, data) {
            assert.ok(!err);
            assert.equal(data._id, mediaMsgId);
            done();
        });
    });
});

describe('updateMessage', function () {

    it('success to update txt message', function (done) {
        var update = {content: 'new content'};
        MessageService.update(txtMsgId, update, function (err, data) {
            assert.ok(!err);
            assert.equal(data.content, update.content);
            done();
        });
    });

    it('success to update media message', function (done) {
        var update = {mediaId: 'media456'};

        MessageService.update(mediaMsgId, update, function (err, data) {
            assert.ok(!err);
            assert.equal(data.mediaId, update.mediaId);
            done();
        });
    });
});

describe('updateMessageByCondition', function () {

    it('success to update txt message by condition', function (done) {
        var update = {content: 'condition update'};
        var condition = {
            _id: txtMsgId
        }
        MessageService.updateByCondition(condition, update, function (err, data) {
            assert.ok(!err);
            assert.equal(data.content, update.content);
            done();
        });
    });

    it('success to update media message by condition', function (done) {
        var update = {content: 'condition update'};
        var condition = {
            _id: mediaMsgId
        }
        MessageService.updateByCondition(condition, update, function (err, data) {
            assert.ok(!err);
            assert.equal(data.content, update.content);
            done();
        });
    });
});

describe('findMessage', function () {
    var params = {
        conditions: {
            channel: channel
        },
        page: {
            no: 1,
            size: 2
        }
    }
    it('success to find message', function (done) {
        MessageService.find(params, function (err, data) {
            assert.ok(!err);
            console.log(data.length);
            assert.equal(params.page.size, data.length);
            done();
        });
    });
});

describe('filterMessage', function () {
    var params = {
        conditions: {
            channel: channel
        },
        page: {
            no: 1,
            size: 2
        }
    }
    it('success to filter message', function (done) {
        MessageService.find(params, function (err, data) {
            assert.ok(!err);
            console.log(data.length);
            assert.equal(params.page.size, data.length);
            done();
        });
    });
});

describe('delMessage', function () {

    it('success to del txt message', function (done) {
        MessageService.delete(txtMsgId, function (err, data) {
            assert.ok(!err);
            done();
        });
    });

    it('success to del media message', function (done) {
        MessageService.delete(mediaMsgId, function (err, data) {
            assert.ok(!err);
            done();
        });
    });
});
