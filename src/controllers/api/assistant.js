var wechatBotService = require('../../modules/wechat-bot/services/WechatBotService');
var lifeFlagEnum = require('../../framework/model/enums').LifeFlag;
var userService = require('../../modules/user/services/UserService');
var batchMessageService = require('../../modules/message/services/BatchMessageService');
var UserRole = require('../../modules/common/models/TypeRegistry').item('UserRole');
var MsgContentType = require('../../modules/common/models/TypeRegistry').item('MsgContent');
var BatchType = require('../../modules/common/models/TypeRegistry').item('BatchType');
var botManager = require('../../modules/assistant/botManager');
var wechatBotGroupService = require('../../modules/wechat-bot/services/WechatBotGroupService');

var Promise = require('bluebird');

module.exports = function(router) {

    router.get('/contacts', function*(){
        try{
            var bot_id = this.query.bot_id;
            var params = {
                conditions: {
                    bot_id: bot_id,
                    role: UserRole.Customer.value()
                }
            }
            var sbotUsers = yield userService.findAsync(params);
            this.body = sbotUsers;
        }catch(err){
            console.log('assistant router load one err:' + err);
            this.body = null;
        }
    });

    router.get('/groups', function*(){
        try{
            var botId = this.query.botId;
            var groups = yield wechatBotGroupService.getGroupListAsync(botId);
            this.body = groups;
        }catch(err){
            console.log('assistant router load one err:' + err);
            this.body = null;
        }
    });

    router.get('/loadOne', function*(){
        try{
            var id = this.query.id;
            var assistant = yield wechatBotService.loadByIdAsync(id);
            assistant.lFlg = lifeFlagEnum.text(assistant.lFlg);//change lFlag to text
            this.body = assistant;
        }catch(err){
            console.log('assistant router load one err:' + err);
            this.body = null;
        }
    });

    router.get('/loadAll', function*(){
        try{
            var assistantList = yield wechatBotService.loadAsync();
            assistantList = assistantList.map(function(item, index){
                item.lFlg = lifeFlagEnum.text(item.lFlg);//change lFlag to text
                return item;
            });
            this.body = assistantList;
        }catch(err){
            console.log('assistant router load err:' + err);
            this.body = null;
        }
    });

    router.post('/mass', function*(){
        try{
            var bot_id = this.request.body.bot_id;
            var botId = this.request.body.botId;//sbot _id
            var type = this.request.body.type;
            var msg = this.request.body.msg;
            var batchMessage = {
                from: botId,
                contentType: MsgContentType.text.value(),
                content: msg
            }
            if(type === 'single') {
                var params = {
                    conditions: {
                        bot_id: bot_id,
                        role: UserRole.Customer.value()
                    }
                }
                batchMessage.batchType = BatchType.single.value();
                var toUsers = [];
                var sbotUsers = yield userService.findAsync(params);
                for (var i = 0; i < sbotUsers.length; i++) {
                    var message = {
                        ToUserName: sbotUsers[i].bot_uid,
                        FromUserName: bot_id,
                        MsgType: 'text',
                        Content: msg
                    }
                    console.log('*************************');
                    console.log(message);
                    toUsers.push(sbotUsers[i]._id);
                    botManager.sendText(bot_id, message);
                }
                batchMessage.toUsers = toUsers;
            }else if(type === 'group'){
                batchMessage.batchType = BatchType.group.value();
                var toGroups = [];
                var groups = yield wechatBotGroupService.getGroupListAsync(botId);
                for (var i = 0; i < groups.length; i++) {
                    var message = {
                        ToUserName: groups[i].name,
                        FromUserName: bot_id,
                        MsgType: 'text',
                        Content: msg
                    }
                    console.log('*************************');
                    console.log(message);
                    toGroups.push(groups[i]._id);
                    botManager.sendText(bot_id, message);
                }
                batchMessage.toGroups = toGroups;
            }
            yield batchMessageService.createAsync(batchMessage);
            this.body = {success: true, err: null};
        }catch(err){
            console.log('assistant router mass err:' + err);
            this.body = {success: false, err: null};
        }
    });
}