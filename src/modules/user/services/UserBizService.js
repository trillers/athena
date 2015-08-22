var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var UserBiz = require('../models/UserBiz').model;
var Promise = require('bluebird');

var Service = {};

Service.load = function (id, callback) {
    UserBiz.findById(id).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load userBiz [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load  userBiz [id=' + id + ']');
        if (callback) callback(null, doc);
    })
};

Service.loadByOpenid = function (openid, callback) {
    UserBiz.findOne({wx_openid: openid}).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load userBiz [id=' + doc._id + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        if (doc){
            logger.debug('Succeed to load  userBiz [id=' + doc._id + ']');
        }
        if (callback) callback(null, doc);
    })
};

Service.create = function (json, callback) {
    var userBiz = new UserBiz(json);
    userBiz.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create userBiz: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create userBiz: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create userBiz'));
        }
    });
};

Service.delete = function (id, callback) {
    UserBiz.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete userBiz [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete userBiz [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    UserBiz.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update userBiz [id=' + id + ']');
            callback(null, result);
        }
    });
};

Service.updateByCondition = function (condition, update, callback) {
    UserBiz.findOneAndUpdate(condition, update, {new: true}, function (err, doc){
        if(err) {
            callback(err);
        } else {
            if(doc){
                logger.debug('Succeed to update userBiz [id=' + doc._id + ']');
                return callback(null, doc);
            }
            callback(null, null);
        }
    });
};

Service.find = function (params, callback) {
    var query = UserBiz.find();

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
    var query = UserBiz.find();

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


Service = Promise.promisifyAll(Service);

module.exports = Service;


