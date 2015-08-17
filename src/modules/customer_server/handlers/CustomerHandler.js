var CSHandler = require('../common/CSHandler');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var ConversationState = require('../../common/models/TypeRegistry').item('ConversationState');
var cskv = require('../kvs/CustomerServer');
var conversationQueue = require('../../conversation/common/ConversationQueue');
var conversationService = require('../../conversation/services/ConversationService');
var messageService = require('../../message/services/MessageService')
var wechatApi = require('../../wechat/common/api').api;

var handle = function(user, message, res){
    _fetchConversationAsync(user)
        .then(function(conversation){
            if(ConversationState.valueNames(conversation.stt) === 'Handing'){
                switch(message.MsgType){
                    case 'text':
                        co(function* (){
                            yield wechatApi.sendTextAsync(customer, message.Content);
                        })
                        break;
                    case 'image':
                        co(function* (){
                            yield wechatApi.sendImageAsync(customer, message.MediaId);
                        })
                        break;
                    case 'voice':
                        co(function* (){
                            yield wechatApi.sendVoiceAsync(customer, message.MediaId);
                        })
                        break;
                }
            }
            return conversation;
        })
        .then(function(conversation){
            var msg = {
                from: user.wx_openid,
                to: conversation && conversation.csId || '',
                contentType: _char0UpperCase(message.type),
                content: {type: message.content}
            }
            return messageService.create(msg)
        })
}
function _fetchConversation(user, callback){
    return cskv.loadCSSByIdAsync(user.wx_openid)
        .then(function(conversation){
            if(conversation){
                return callback(null, conversation);
            }
            var conversation = {
                initiator: user.wx_openid,
                createTime: new Date()
            }
            conversationService.createAsync(conversation)
                .then(function(conversation){
                    conversationQueue.enqueue(conversation);
                    return callback(null, conversation)
                })
        })
        .catch(function(err){
            return callback(err, null);
        })
}
function _char0UpperCase(string){
    return String.uppercase(string.charAt(0)) + string.slice(1);
}
_fetchConversationAsync = Promise.promisify(_fetchConversation);
var handler = new CSHandler(UserRole.RegularUser.value(), handle());

module.exports = handler;


