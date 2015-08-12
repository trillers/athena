var Party = require('../models/Party').model;
var organizationService = require('./OrganizationService');
var PartyEnum = require('../../common/models/TypeRegistry').item('Party');
var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var subpartyServiceMap = {
    'Org': organizationService
}
var Service = {};

Service.load = function* (id) {
    try {
        var doc = yield Case.findById(id).lean(true).exec();
        var subpartyService = subpartyServiceMap[PartyEnum.valueNames(doc.type)];
        var subparty = yield subpartyService.loadAysnc(doc.subcase);
        doc.subparty = subparty;
        logger.debug('Succeed to load  Party [id=' + id + ']');
        return doc;
    }catch(e){
        logger.error('Fail to load Party [id=' + id + ']: ' + e);
    }
};

Service.create = function* (json) {
    try{
        var subpartyService = subpartyServiceMap[PartyEnum.valueNames(json.type)];
        var abscase = new Case(json);
        var resultArr = yield [abscase.save(), subcaseService.createAsync(json)];
        var result = resultArr[0].toObject();
        result.subcase = resultArr[1];
        logger.debug('Succeed to create Case: ' + require('util').inspect(result) + '\r\n');
        return result;
    }catch(e){
        logger.error('Fail to create Case: ' + require('util').inspect(result) + '\r\n');
    }
};

Service.delete = function* (id) {
    try{
        var doc = yield Case.findByIdAndRemove(id).exec();
        logger.debug('Succeed to delete Case [id=' + id + ']');
        return doc;
    }catch(e){
        logger.error('Fail to delete Case [id=' + id + ']: ' + e);
    }
};

Service.update = function* (id, update) {
    var doc = Case.findByIdAndUpdate(id, update, {new: true}).exec();
    logger.debug('Succeed to update Conversation [id=' + id + ']');
    return doc;
};

Service.updateByCondition = function* (condition, update) {
    var doc = Case.findOneAndUpdate(condition, update, {new: true});
    logger.debug('Succeed to update Conversation [id=' + doc._id + ']');
    return doc;
};

Service.find = function* (params) {
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
    var docs = yield query.exec();
    return docs;
};

Service.filter = function* (params) {
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
    var docs = yield query.exec();
    return docs;
};

module.exports = Service;