var wechatBotService = require('../../modules/wechat-bot/services/WechatBotService');
var lifeFlagEnum = require('../../framework/model/enums').LifeFlag;
var userService = require('../../modules/user/services/UserService');
var UserRole = require('../../modules/common/models/TypeRegistry').item('UserRole');
var botManager = require('../../modules/assistant/botManager');

var Promise = require('bluebird');

module.exports = function(router) {
    router.get('/loadOne', function*(){
        try{
            var id = this.query.id;
            var assistant = yield wechatBotService.loadByIdAsync(id);
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
            var params = {
                conditions: {
                    bot_id: {$ne: null},
                    role: UserRole.Customer.value()
                }
            }

            var bot_id = this.request.body.bot_id;
            var msg = this.request.body.msg;
            var sbotUsers = yield userService.findAsync(params);
            for(var i = 0; i < sbotUsers.length; i++){
                var message = {
                    ToUserName: sbotUsers[i].bot_uid,
                    FromUserName: bot_id,
                    MsgType: 'text',
                    Content: msg
                }
                console.log('*************************');
                console.log(message);
                botManager.sendText(bot_id, message);
            }
            this.body = {success: true, err: null};
        }catch(err){
            console.log('assistant router mass err:' + err);
            this.body = {success: false, err: null};
        }
    });
}