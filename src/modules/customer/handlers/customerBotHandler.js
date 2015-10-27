var wechatBotUserService = require('../../user/services/WechatBotUserService');




/**
 *     ToUserName: botid (bucketid:openid)
 *     FromUserName: bid
 *     MsgType: 'text'
 *     Content: to-be-sent text String
 *     bucketid
 *     openid
 *
 * @param msg
 */
var handler = function(msg){
    wechatBotUserService.loadByBuid(msg.FromUserName, function(err, user){
        console.info(user);
    });


};
module.exports = handler;