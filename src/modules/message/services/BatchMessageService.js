var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var BatchMessage = require('../models/BatchMessage').model;
var Promise = require('bluebird');

var Service = {};

Service.load = function (id, callback) {
    BatchMessage.findById(id).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load BatchMessage [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load  BatchMessage [id=' + id + ']');
        if (callback) callback(null, doc);
    })
};

Service.create = function (json, callback) {
    var batchMessage = new BatchMessage(json);
    batchMessage.save(function (err, doc, numberAffected) {
        if (err) {
            logger.error('Fail to create BatchMessage: ' + err + '\r\n');
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create BatchMessage: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc.toObject());
        }
        else {
            logger.error('Fail to create BatchMessage: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create BatchMessage'));
        }
    });
};

Service.delete = function (id, callback) {
    BatchMessage.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete BatchMessage [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete Message [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    BatchMessage.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update Message [id=' + id + ']');
            callback(null, result);
        }
    });
};

Service.updateByCondition = function (condition, update, callback) {
    BatchMessage.findOneAndUpdate(condition, update, {new: true}, function (err, doc){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update BatchMessage [id=' + doc._id + ']');
            callback(null, doc);
        }
    });
};

Service.find = function (params, callback) {
    var query = BatchMessage.find();

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
    var query = BatchMessage.find();

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


