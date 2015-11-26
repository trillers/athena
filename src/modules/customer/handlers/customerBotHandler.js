/**
 *     ToUserName: botid (bucketid:openid)
 *     FromUserName: bid
 *     MsgType: 'text'
 *     Content: to-be-sent text String
 *     bucketid
 *     openid
 *     MediaId
 *     FsMediaId
 *
 * @param msg
 */
var co = require('co');
var conversationService = require('../../conversation/services/ConversationService');
var messageService = require('../../message/services/MessageService');
var caseMessageService = require('../../case/services/CaseMessageService');
var ConversationKv = require('../../conversation/kvs/Conversation');
var mediaFileService = require('../../file/services/MediaFileService');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var wechatBotGroupService = require('../../wechat-bot/services/WechatBotGroupService');
var wechatBotService = require('../../wechat-bot/services/WechatBotService');
var customerEmitter = require('../CustomerEmitter');
var wechatBotUserService = require('../../user/services/WechatBotUserService');
var handler = function (msg) {
    co(function* () {
        try {
            var bot_id = msg.bucketid + ':' + msg.openid;
            var bot = yield wechatBotService.loadByOpenidAsync(msg.openid);
            var user = yield wechatBotUserService.loadByNicknameOrBuidAsync(msg.FromUserName, bot_id);
            console.log("=====bot=====");
            console.log(bot);
            if (!user) {
                console.log('this maybe a group message');
                var botId = bot && bot._id || 'null';
                var group = yield wechatBotGroupService.getGroupByNameAsync(msg.FromUserName, botId);
                console.log('================group====================');
                console.log(group);
                if (group && group._id) {
                    yield caseMessageService.createAsync({
                        from: group._id,
                        to: null,
                        channel: null,
                        contentType: msg.MsgType,
                        content: msg.Content || null,
                        wx_media_id: msg.MediaId || null,
                        an_media_id: msg.FsMediaId || null,
                        recognition: msg.Recognition || null
                    });
                }
                return;
            }
            yield caseMessageService.createAsync({
                from: user.id,
                to: null,
                channel: null,
                contentType: msg.MsgType,
                content: msg.Content || null,
                wx_media_id: msg.MediaId || null,
                an_media_id: msg.FsMediaId || null,
                recognition: msg.Recognition || null
            });
        }
        catch (e) {
            console.error(e);
        }
    });
};
function validateFromUser(username) {
    return username.split('-')[0] === 'bu';
}
module.exports = handler;