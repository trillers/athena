var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var WechatBotGroup = require('../models/WechatBotGroup').model;
var lifeFlagEnum = require('../../../framework/model/enums').LifeFlag;
var Service = {};

Service.syncGroupList = function(botId, list, callback){
    WechatBotGroup.find(
        {bot: botId},
        function (err, storedGroups) {
            if (err) {
                logger.error('Fail to lock wechat bot '+ botId +': ' + err);
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
    for(var i=0; i<newLen; i++){
        var group = oldGroupList[i];
        oldGroupMap[group.name] = group;
    }
    var newLen = newGroupList.length;
    for(var i=0; i<newLen; i++){
        var group = newGroupList[i];
        group.name && (group.name = group.name.trim());

        var theSameGroup = oldGroupMap[group.name];
        if(theSameGroup) {
            //if(theSameGroup.name !== group.name){
            //    theSameGroup.name = group.name;
            //    ret.toUpdate.push(theSameGroup);
            //}
            delete oldGroupMap[group.name];
        }
        else{
            group.bot = botId;
            ret.toAdd.push(group);
        }
    }

    for(var p in oldGroupMap){
        ret.toRemove.push(oldGroupMap[p]);
        ret.toRemoveIds.push(oldGroupMap[p]._id);
    }

    return ret;
};

Service = Promise.promisifyAll(Service);

module.exports = Service;