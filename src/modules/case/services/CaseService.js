var Case = require('../models/Case').model;
var caseTaxiService = require('./CaseTaxiService');
var caseCoffeeService = require('./CaseCoffeeService');
var CaseStatus = require('../../common/models/TypeRegistry').item('CaseStatus');
var settings = require('athena-settings');
var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var wechat = require('../../../app/wechat/api');
var Promise = require('bluebird');
var subcaseServiceMap = {
    'Taxi': caseTaxiService,
    'Coffee': caseCoffeeService
}
var Service = {};

Service.load = function* (id) {
    try {
        var doc = yield Case.findById(id).lean(true).exec();
        var subcaseService = subcaseServiceMap[CaseStatus.name(doc.type)];
        var subcase = yield subcaseService.loadAysnc(doc.subcase);
        logger.debug('Succeed to load  Case [id=' + id + ']');
        doc.subcase = subcase;
        return doc;
    }catch(e){
        logger.error('Fail to load Case [id=' + id + ']: ' + e);
        Promise.reject(new Error('Fail to load Case [id=' + id + ']: ' + e));
    }
};

Service.create = function* (json) {
    var abscase = new Case(json);
    console.log(yield abscase.save());


    //function (err, doc, numberAffected) {
    //    if (err) {
    //        if (callback) callback(err);
    //        return;
    //    }
    //    if (numberAffected) {
    //        logger.debug('Succeed to create Conversation: ' + require('util').inspect(doc) + '\r\n');
    //        if (callback) callback(null, doc);
    //    }
    //    else {
    //        logger.error('Fail to create Conversation: ' + require('util').inspect(doc) + '\r\n');
    //        if (callback) callback(new Error('Fail to create Conversation'));
    //    }
    //}
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


Service = Promise.promisifyAll(Service);

module.exports = Service;