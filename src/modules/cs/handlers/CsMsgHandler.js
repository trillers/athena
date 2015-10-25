var cskv = require('../kvs/CustomerService');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var wechatApi = require('../../wechat/common/api').api;
var ConversationKv = require('../../conversation/kvs/Conversation');
var messageService = require('../../message/services/MessageService');
var mediaFileService = require('../../file/services/MediaFileService');
var userService = require('../../user/services/UserService');
var co = require('co');
module.exports = function(emitter){
        emitter.message(function(message, context) {
            co(function* (){
                var user = context.user;
                var message = context.weixin;
                var cvsId = yield ConversationKv.getCurrentCidAsync(user.id)
                if (cvsId) {
                    var cvs = yield ConversationKv.loadByIdAsync(cvsId);
                    var customer = cvs.initiator;
                    var an_media_id = '';
                    switch (message.MsgType){
                        case MsgContentType.image.value():
                            an_media_id = yield mediaFileService.saveImage(message.MediaId);
                            break;
                        case MsgContentType.voice.value():
                            an_media_id = yield mediaFileService.saveVoice(message.MediaId);
                            break;
                    }
                    var msg = {
                        from: user,
                        to: customer,
                        contentType: MsgContentType.names(message.MsgType),
                        content: message.Content || null,
                        wx_media_id: message.MediaId || null,
                        an_media_id: an_media_id,
                        recognition: message.Recognition || null,
                        channel: cvs._id
                    };
                    try {
                        yield messageService.createAsync(msg);
                        var user = yield userService.loadByIdAsync(customer);
                        var openid = user.wx_openid;
                        switch (message.MsgType) {
                            case 'text':
                                yield wechatApi.sendTextAsync(openid, message.Content);
                                break;
                            case 'image':
                                yield wechatApi.sendImageAsync(openid, message.MediaId);
                                break;
                            case 'voice':
                                yield wechatApi.sendVoiceAsync(openid, message.MediaId);
                                break;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    yield wechatApi.sendTextAsync(user.wx_openid, '[系统]: 您还没有建立会话');
                }
                //yield cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid);
                return;
            });
        })
};