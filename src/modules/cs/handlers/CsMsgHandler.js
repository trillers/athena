var cskv = require('../kvs/CustomerService');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var wechatApi = require('../../wechat/common/api').api;
var ConversationKv = require('../../conversation/kvs/Conversation');
var messageService = require('../../message/services/MessageService');
var userService = require('../../user/services/UserService');
var co = require('co');
module.exports = function(emitter){
        emitter.message(function(message, context) {
            co(function* (){
                var user = context.user;
                var message = context.weixin;
                var cvsId = yield ConversationKv.getCurrentCidAsync(user.id)
                if (cvsId) {
                    var data = yield ConversationKv.loadByIdAsync(cvsId);
                    var customer = data.initiator;
                    var msg = {
                        from: user,
                        to: customer,
                        contentType: MsgContentType.names(message.MsgType),
                        content: message.Content || message.MediaId,
                        channel: data._id
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
                    yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:您还没有建立会话');
                }
                yield cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid);
                return;
            });
        })
};