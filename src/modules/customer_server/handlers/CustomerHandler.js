var CSHandler = require('../common/CSHandler');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var ConversationState = require('../../common/models/TypeRegistry').item('ConversationState');
var cskv = require('../kvs/CustomerServer');
var conversationQueue = require('../../conversation/common/ConversationQueue');
var conversationService = require('../../conversation/services/ConversationService');
var messageService = require('../../message/services/MessageService')
var wechatApi = require('../../wechat/common/api').api;
var Promise = require('bluebird');
var co = require('co');

var handle = function(user, message){
    console.log('ru handle start');
    console.log('queue----------------')
    console.log(conversationQueue);
    _fetchConversationAsync(user)
        .then(function(conversation){
            if(ConversationState.valueNames(conversation.stt) === 'Handing'){
                var csId = conversation.csId;
                switch(message.MsgType){
                    case 'text':
                        co(function* (){
                            yield wechatApi.sendTextAsync(csId, message.Content);
                        })
                        break;
                    case 'image':
                        co(function* (){
                            yield wechatApi.sendImageAsync(csId, message.MediaId);
                        })
                        break;
                    case 'voice':
                        co(function* (){
                            yield wechatApi.sendVoiceAsync(csId, message.MediaId);
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
                contentType: message.MsgType,
                content: message.Content,
                channel: conversation._id
            }
            return messageService.create(msg)
        })
}
function _fetchConversation(user, callback){
    return cskv.loadCSSByIdAsync(user.wx_openid)
        .then(function(conversation){
            if(conversation){
                console.log('have css');
                return callback(null, conversation);
            }

            return cskv.loadConQueueAsync();
        })
        .then(function(conQueue){
            var con = null;
            conQueue.forEach(function(item){
                console.log(item.initiator == user.wx_openid);
                if(item.initiator == user.wx_openid){
                    con = item;
                }
            });
            if(con) return callback(null, con);
            var conversation = {
                initiator: user.wx_openid,
                createTime: new Date()
            }
            conversationService.createAsync(conversation)
                .then(function(conversation){
                    console.log('created conversation');
                    conversationQueue.enqueue(conversation);
                    return callback(null, conversation)
                });
        })
        .catch(function(err){
            return callback(err, null);
        })
}

_fetchConversationAsync = Promise.promisify(_fetchConversation);
var handler = new CSHandler(UserRole.RegularUser.value(), handle);

module.exports = handler;


