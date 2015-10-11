var logger = require('../../../app/logging').logger;
var ConversationState = require('../../common/models/TypeRegistry').item('ConversationState');
var u = require('../../../app/util');
var Conversation = require('../models/Conversation').model;
var Promise = require('bluebird');
var kvs = require('../kvs/Conversation');
var Service = {};

Service.load = function (id, callback) {
    Conversation.findById(id).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load Conversation [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load  Conversation [id=' + id + ']');
        if (callback) callback(null, doc);
    })
};

Service.loadById = function (id, callback) {
    Conversation.findById(id).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load Conversation [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load  Conversation [id=' + id + ']');
        if (callback) callback(null, doc ? doc.toObject() : null);
    })
};

Service.create = function (json, callback) {
    var conversation = new Conversation(json);
    conversation.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create Conversation: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc.toObject());
        }
        else {
            logger.error('Fail to create Conversation: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create Conversation'));
        }
    });
};

Service.delete = function (id, callback) {
    Conversation.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete Conversation [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete Conversation [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    Conversation.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update Conversation [id=' + id + ']');
            callback(null, result);
        }
    });
};

Service.updateByCondition = function (condition, update, callback) {
    Conversation.findOneAndUpdate(condition, update, {new: true}, function (err, doc){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update Conversation [id=' + doc._id + ']');
            callback(null, doc);
        }
    });
};

Service.find = function (params, callback) {
    var query = Conversation.find();

    if (params.options) {
        query.setOptions(params.options);
    }

    if (params.sort) {
        query.sort(params.sort);
    }

    if (params.page) {
        var skip = (params.page.no - 1) * params.page.size;
        var limit = params.page.size;
        if (skip) query.skip(skip);
        if (limit) query.limit(limit);
    }

    if (params.conditions) {
        query.find(params.conditions);
    }


    //TODO: specify select list, exclude comments in list view
    query.lean(true);
    query.exec(function (err, docs) {
        if (err) {
            callback(err);
            return;
        }

        if (callback) callback(null, docs);
    });
};

Service.filter = function (params, callback) {
    var query = Conversation.find();

    if (params.options) {
        query.setOptions(params.options);
    }

    if (params.sort) {
        query.sort(params.sort);
    }

    if (params.page) {
        var skip = (params.page.no - 1) * params.page.size;
        var limit = params.page.size;
        if (skip) query.skip(skip);
        if (limit) query.limit(limit);
    }

    if (params.conditions) {
        query.find(params.conditions);
    }
    query.lean(true);
    query.exec(function (err, docs) {
        if (err) {
            callback(err);
            return;
        }

        if (callback) callback(null, docs);
    });
};

Service.destroy = function(cvs, callback){
    console.log(cvs);
    kvs.delCurrentIdAsync(cvs.initiator)
        .then(function(){
            return kvs.delCurrentCidAsync(cvs.csId);
        })
        .then(function(){
            return kvs.delByIdAsync(cvs._id);
        })
        .then(function(){
            return callback(null, null);
        })
        .catch(Error, function(err){
            return callback(err, null);
        })
};

Service.close = function(cvs, callback){
    Service.update(cvs.id, {stt: ConversationState.Finished.value()}, function(err){
        if(err){
            return callback(err, null);
        }
        Service.destroy(cvs, function(err){
            if(err){
                return callback(err, null);
            }
            callback(null, null);
        })
    })
};

Service.getTodayCvsSum = function(callback){
    var startTime = new Date();
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    var endTime = new Date();
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);
    Conversation.count({createTime: {$gt: startTime, $lt: endTime}}, function(err, count){
       if(err){
           if(callback) return callback(err, null);
       }
       if(callback) return callback(null, count);
    });
}

Service = Promise.promisifyAll(Service);

module.exports = Service;


