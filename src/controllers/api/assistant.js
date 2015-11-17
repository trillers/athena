var wechatBotService = require('../../modules/wechat-bot/services/WechatBotService');
var lifeFlagEnum = require('../../framework/model/enums').LifeFlag;
var userService = require('../../modules/user/services/UserService');
var fileService = require('../../modules/file/services/FileService');
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

    /**
     * send text to all contacts
     * @body bot_id
     * @body botId //sbot _id
     * @body msg
     * */
    router.post('/sendTextToContacts', function*(){
        var bot_id = this.request.body.bot_id;
        var botId = this.request.body.botId;//sbot _id
        var msg = this.request.body.msg;
        var batchMessage = {
            from: botId,
            contentType: MsgContentType.text.value(),
            content: msg,
            batchType: BatchType.contacts.value()
        }
        var params = {
            conditions: {
                bot_id: bot_id,
                role: UserRole.Customer.value()
            }
        }
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
        console.log(batchMessage);
        yield batchMessageService.createAsync(batchMessage);
        this.body = {success: true, err: null};
    });

    /**
     * send text to all groups
     * @body bot_id
     * @body botId //sbot _id
     * @body msg
     * */
    router.post('/sendTextToGroups', function*(){
        var bot_id = this.request.body.bot_id;
        var botId = this.request.body.botId;//sbot _id
        var msg = this.request.body.msg;
        var batchMessage = {
            from: botId,
            contentType: MsgContentType.text.value(),
            content: msg,
            batchType: BatchType.group.value()
        }
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
        console.log(batchMessage);
        yield batchMessageService.createAsync(batchMessage);
        this.body = {success: true, err: null};
    });

    /**
     * send image to all contacts
     * @body bot_id
     * @body botId //sbot _id
     * @body media_id
     * */
    router.post('/sendImageToContacts', function*() {
        try {
            var bot_id = this.request.body.bot_id;
            var botId = this.request.body.botId;//sbot _id
            var media_id = this.request.body.media_id;
            var batchMessage = {
                from: botId,
                contentType: MsgContentType.image.value(),
                media_id: media_id,
                batchType: BatchType.contacts.value()
            }
            var params = {
                conditions: {
                    bot_id: bot_id,
                    role: UserRole.Customer.value()
                }
            }
            var toUsers = [];
            var sbotUsers = yield userService.findAsync(params);
            var image = yield fileService.loadAsync(media_id);
            for (var i = 0; i < sbotUsers.length; i++) {
                var message = {
                    ToUserName: sbotUsers[i].bot_uid,
                    FromUserName: bot_id,
                    MsgType: 'image',
                    MediaId: media_id,
                    Url: image.path
                }
                console.log('*************************');
                console.log(message);
                toUsers.push(sbotUsers[i]._id);
                botManager.sendImage(bot_id, message);
            }
            batchMessage.toUsers = toUsers;
            console.log(batchMessage);
            yield batchMessageService.createAsync(batchMessage);
            this.body = {success: true, err: null};
        } catch (e) {
            console.log('failed to sendImageToContacts err: ' + e);
            this.body = {success: false, err: e};
        }
    });

    /**
     * send image to all groups
     * @body bot_id
     * @body botId //sbot _id
     * @body media_id
     * */
    router.post('/sendImageToGroups', function*(){
        try{
            var bot_id = this.request.body.bot_id;
            var botId = this.request.body.botId;//sbot _id
            var media_id = this.request.body.media_id;
            var batchMessage = {
                from: botId,
                contentType: MsgContentType.image.value(),
                media_id: media_id,
                batchType: BatchType.group.value()
            }
            var toGroups = [];
            var groups = yield wechatBotGroupService.getGroupListAsync(botId);
            var image = yield fileService.loadAsync(media_id);
            for (var i = 0; i < groups.length; i++) {
                var message = {
                    ToUserName: groups[i].name,
                    FromUserName: bot_id,
                    MsgType: 'image',
                    MediaId: media_id,
                    Url: image.path
                }
                console.log('*************************');
                console.log(message);
                toGroups.push(groups[i]._id);
                botManager.sendImage(bot_id, message);
            }
            batchMessage.toGroups = toGroups;
            console.log(batchMessage);
            yield batchMessageService.createAsync(batchMessage);
            this.body = {success: true, err: null};
        } catch (e){
            console.log('failed to sendImageToGroups err: ' + e);
            this.body = {success: false, err: e};
        }

    });

    router.get('/getBatchMsg', function*(){
        var botId = this.query.botId;
        var batchType = this.query.type;
        var params = {
            conditions:{
                from: botId,
                batchType: batchType
            },
            sort: {
                crtOn: -1
            }
        }
        try {
            var data = yield batchMessageService.findAsync(params);
            var batchMsg = data.length > 0 ? data : null;
            this.body = {batchMsg: batchMsg, type: batchType};
        }catch(err){
            console.log('getBatchMsg err: ' + err);
            this.body = {batchMsg: null, type: batchType};
        }

    });

    /**
     * async assistant contact or group
     * @param bot_id
     * @param type single or group
     * **/
    router.post('/async', function*(){
        var bot_id = this.request.body.bot_id;
        var type = this.request.body.type;
        if(type === 'contacts'){
            botManager.requestContactListRemark(bot_id);
        }
        if(type === 'group'){
            botManager.requestGroupList(bot_id);
        }
        this.body = {success: true, type: type};
    })
}