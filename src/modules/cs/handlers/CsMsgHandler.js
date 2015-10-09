var cskv = require('../kvs/CustomerService');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var wechatApi = require('../../wechat/common/api').api;
module.exports = function(emitter){
        emitter.message(function(message, context){
            var user = context.user;
            var message = context.weixin;
            cskv.loadCSSByIdAsync(user.wx_openid)
                .then(function(data){
                    if(data){
                        var customer = data.initiator;
                        var msg = {
                            from: user.wx_openid,
                            to: customer,
                            contentType: MsgContentType.names(message.MsgType),
                            content: message.Content || message.MediaId,
                            channel: data._id
                        };
                        co(function* (){
                            yield MessageService.createAsync(msg);
                            switch(message.MsgType){
                                case 'text':
                                    yield wechatApi.sendTextAsync(customer, message.Content);
                                    break;
                                case 'image':
                                    yield wechatApi.sendImageAsync(customer, message.MediaId);
                                    break;
                                case 'voice':
                                    yield wechatApi.sendVoiceAsync(customer, message.MediaId);
                                    break;
                            }
                        })
                    }else{
                        return wechatApi.sendTextAsync(user.wx_openid, '[系统]:您还没有建立会话');
                    }
                })
                .then(function(){
                    return cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid);
                })
        })
};