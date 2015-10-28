var wechatBotService = require('../../modules/wechat-bot/services/WechatBotService');
var lifeFlagEnum = require('../../framework/model/enums').LifeFlag;

var Promise = require('bluebird');

module.exports = function(router) {
    router.get('/load', function*(){
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
}