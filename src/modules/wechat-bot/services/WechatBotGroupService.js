var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var WechatBotGroup = require('../models/WechatBotGroup').model;
var lifeFlagEnum = require('../../../framework/model/enums').LifeFlag;
var Service = {};

Service.getGroupList = function(botId,  callback){
    WechatBotGroup.find(
        {bot: botId, lFlg: lifeFlagEnum.Active},
        null,
        {lean: true},
        function (err, storedGroups) {
            if (err) {
                logger.error('Fail to get wechat bot ' + botId + ': ' + err);
                callback(err);
            }
            else{
                logger.info('Succeed to get wechat bot ' + botId);
                callback(null, storedGroups);
            }
        });
};

Service.syncGroupList = function(botId, list, callback){
    WechatBotGroup.find(
        {bot: botId},
        function (err, storedGroups) {
            if (err) {
                logger.error('Fail to find all groups of wechat bot '+ botId +': ' + err);
                callback(err);
            }
            else{
                //logger.warn(storedGroups);
                //logger.warn('=====================');
                //logger.warn(list);
                //logger.warn('=====================');
                var change = Service.diffGroupList(storedGroups, list, botId);
                //logger.warn(change);

                var result = {disables:0, enables:0, adds:0, updates:0, stays: 0};
                co(function*(){
                    try{
                        //if(change.toDisableIds.length>0){
                        //    yield WechatBotGroup.update({_id: {$in: change.toDisableIds}}, {lFlg: lifeFlagEnum.Inactive}, {multi: true}).exec();
                        //}
                        result.disables = change.toDisableIds.length;

                        if(change.toEnableIds.length>0){
                            yield WechatBotGroup.update({_id: {$in: change.toEnableIds}}, {lFlg: lifeFlagEnum.Active}, {multi: true}).exec();
                        }
                        result.enables = change.toEnableIds.length;

                        if(change.toAdd.length>0){
                            yield WechatBotGroup.create(change.toAdd);
                        }
                        result.adds = change.toAdd.length;

                        //TODO: update other properties but name
                        //if(change.toUpdate.length>0){
                        //    for(var i=0; i<change.toUpdate.length; i++){
                        //        var update = change.toUpdate[i];
                        //        yield WechatBotGroup.update({_id: update._id}, {name: update.name}).exec();
                        //    }
                        //}
                        result.updates = change.toUpdate.length;

                        result.stays = change.toStay.length;
                        callback(null, result);
                    }
                    catch(e){
                        console.error(e);
                        callback(e);
                    }
                });
            }
        });
};

Service.emptyGroupList = function(botId, callback){
    WechatBotGroup.remove(
        {bot: botId},
        function (err, result) {
            if (err) {
                logger.error('Fail to delete all groups of bot '+ botId + ' : ' + err);
                callback(err);
            }
            else{
                logger.info('Succeed to delete all groups of bot '+ botId);
                callback(null, result);
            }
        });
};

Service.diffGroupList = function(oldGroupList, newGroupList, botId){
    var ret = {
        toAdd: [],
        toEnable: [],
        toEnableIds: [],
        toUpdate: [],
        toDisable: [],
        toDisableIds: [],
        toStay: [],

    };
    var newLen = oldGroupList.length;
    var oldGroupMap = {};
    var oldLeftGroupMap = {};
    for(var i=0; i<newLen; i++){
        var group = oldGroupList[i];
        oldGroupMap[group.name] = group;
        oldLeftGroupMap[group.name] = group;
    }
    var newLen = newGroupList.length;
    for(var i=0; i<newLen; i++){
        var group = newGroupList[i];
        group.name && (group.name = group.name.trim());

        var theSameGroup = oldGroupMap[group.name];
        if(theSameGroup) {
            if(theSameGroup.lFlg === lifeFlagEnum.Active){
                ret.toStay.push(theSameGroup);
            }
            else{
                ret.toEnable.push(theSameGroup);
                ret.toEnableIds.push(theSameGroup._id);

            }
            oldLeftGroupMap[group.name] && (delete oldLeftGroupMap[group.name]);
        }
        else{
            group.bot = botId;
            ret.toAdd.push(group);
        }
    }

    for(var p in oldLeftGroupMap){
        if(oldLeftGroupMap[p].lFlg === lifeFlagEnum.Active){
            ret.toDisable.push(oldLeftGroupMap[p]);
            ret.toDisableIds.push(oldLeftGroupMap[p]._id);
        }
    }

    return ret;
};

/**
 * get webchat bot group by group name
 * @param name
 ***/
Service.getGroupByName = function(name, botId, callback){
    WechatBotGroup.findOne({name: name, bot: botId, lFlg: lifeFlagEnum.Active}).lean().exec(function(err, data){
        console.log('***********************');
        console.log(err);
        console.log(data);
        if(err){
            return callback(err, null);
        }else {
            return callback(null, data);
        }
    })
}

/**
 * get webchat bot group by group id
 * @param name
 ***/
Service.loadById = function(id, callback){
    WechatBotGroup.findOne({_id: id, lFlg: lifeFlagEnum.Active}).populate({path: bot}).lean().exec(function(err, data){
        if(err){
            return callback(err, null);
        }else {
            return callback(null, data);
        }
    })
}

Service = Promise.promisifyAll(Service);

module.exports = Service;