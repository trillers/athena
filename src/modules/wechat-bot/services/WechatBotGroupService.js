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
                var change = Service.diffGroupList(storedGroups, list, botId);
                var result = {removes:0, adds:0, updates:0};
                co(function*(){
                    try{
                        if(change.toRemoveIds.length>0){
                            yield WechatBotGroup.update({_id: {$in: change.toRemoveIds}}, {lFlg: lifeFlagEnum.Inactive}, {multi: true}).exec();
                        }
                        result.removes = change.toRemoveIds.length;

                        if(change.toAdd.length>0){
                            yield WechatBotGroup.create(change.toAdd);
                        }
                        result.adds = change.toAdd.length;

                        if(change.toUpdate.length>0){
                            for(var i=0; i<change.toUpdate.length; i++){
                                var update = change.toUpdate[i];
                                yield WechatBotGroup.update({_id: update._id}, {name: update.name}).exec();
                            }
                        }
                        result.updates = change.toUpdate.length;
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
        toUpdate: [],
        toRemove: [],
        toRemoveIds: []
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
            oldLeftGroupMap[group.name] && (delete oldLeftGroupMap[group.name]);
        }
        else{
            group.bot = botId;
            ret.toAdd.push(group);
        }
    }

    for(var p in oldLeftGroupMap){
        ret.toRemove.push(oldLeftGroupMap[p]);
        ret.toRemoveIds.push(oldLeftGroupMap[p]._id);
    }

    return ret;
};

Service = Promise.promisifyAll(Service);

module.exports = Service;