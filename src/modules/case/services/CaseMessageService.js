var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var CaseMessage = require('../models/CaseMessage').model;
var Promise = require('bluebird');

var Service = {};

Service.load = function (id, callback) {
    CaseMessage.findById(id).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load CaseMessage [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load  CaseMessage [id=' + id + ']');
        if (callback) callback(null, doc);
    })
};

Service.create = function (json, callback) {
    var caseMessage = new CaseMessage(json);
    caseMessage.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err, null);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create CaseMessage: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create CaseMessage: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create CaseMessage'));
        }
    });
};

Service.delete = function (id, callback) {
    CaseMessage.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete CaseMessage [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete CaseMessage [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    CaseMessage.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update CaseMessage [id=' + id + ']');
            callback(null, result);
        }
    });
};

Service.updateByCondition = function (condition, update, callback) {
    CaseMessage.findOneAndUpdate(condition, update, {new: true}, function (err, doc){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update CaseMessage [id=' + doc._id + ']');
            callback(null, doc);
        }
    });
};

Service.find = function (params, callback) {
    var query = CaseMessage.find();

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

    if (params.populate) {
        params.populate.forEach(function(item){
            query.populate(item);
        })
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
    var query = CaseMessage.find();

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

    if (params.populate) {
        params.populate.forEach(function(item){
            query.populate(item);
        })
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


Service = Promise.promisifyAll(Service);

module.exports = Service;