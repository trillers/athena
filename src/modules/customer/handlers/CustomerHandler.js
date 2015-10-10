var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var ConversationState = require('../../common/models/TypeRegistry').item('ConversationState');
var cskv = require('../../cs/kvs/CustomerService');
var conversationQueue = require('../../conversation/common/ConversationQueue');
var conversationService = require('../../conversation/services/ConversationService');
var messageService = require('../../message/services/MessageService')
var wechatApi = require('../../wechat/common/api').api;
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent')
var Promise = require('bluebird');
var co = require('co');
var ConversationKv = require('../../conversation/kvs/Conversation');

var handle = function(user, message){
    console.log('ru handle start');
    console.log('queue----------------')
    console.log(conversationQueue);

    _fetchConversationAsync(user)
        .then(function(conversation){
            if(ConversationState.valueNames(conversation.stt) === 'Handing'){
                co(function* (){
                    var csId = conversation.csId;
                    switch(message.MsgType){
                        case 'text':
                            yield wechatApi.sendTextAsync(csId, message.Content);
                            break;
                        case 'image':
                            yield wechatApi.sendImageAsync(csId, message.MediaId);
                            break;
                        case 'voice':
                            yield wechatApi.sendVoiceAsync(csId, message.MediaId);
                            break;
                    }
                })
            }
            return conversation;
        })
        .then(function(conversation){
            console.log(conversation);
            console.log(message);
            var msg = {
                from: user.wx_openid,
                to: conversation && conversation.csId || '',
                contentType: MsgContentType.names(message.MsgType),
                content: message.Content || message.MediaId,
                channel: conversation._id
            }
            return messageService.createAsync(msg)
        })
        .catch(function(e){
            console.log('Failed to Fetch conversation')
            console.log(e)
        })
}
function _fetchConversation(user){
    //var con = null, conQueue;
    //yield con = cskv.loadCSSByIdAsync(user.wx_openid);
    //if(con) return con;
    //yield conQueue = cskv.loadConQueueAsync();
    //if(conQueue){
    //    conQueue.forEach(function(item){
    //        console.log(item.initiator == user.wx_openid);
    //        if(item.initiator == user.wx_openid){
    //            con = item;
    //        }
    //    });
    //    if(con) return con;
    //}
    //var conversation = {
    //    initiator: user.wx_openid,
    //    createTime: new Date()
    //}
    //yield con = conversationService.createAsync(conversation);
    //return con;
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
                    conversationQueue.enqueue(conversation, function(){
                        return callback(null, conversation)
                    });

                });
        })
        .catch(function(err){
            return callback(err, null);
        })
}

_fetchConversationAsync = Promise.promisify(_fetchConversation);

module.exports = function(emitter){
    var customerEmitter = require('../CustomerEmitter');
    require('./customerCvsHandler')(customerEmitter);
    require('./customerMsgHandler')(customerEmitter);
    emitter.customer(function(event, context){
        co(function* (){
            try{
                var user = context.user;
                var msg = context.weixin;
                var cvs = null;
                var cvsId = yield ConversationKv.getCurrentIdAsync(user.id);
                if(!cvsId){
                    cvs = yield conversationService.createAsync({
                        initiator: user.id, createTime: new Date()
                    });
                    yield ConversationKv.createAsync(cvs);
                    cvsId = cvs.id;
                    yield ConversationKv.setCurrentIdAsync(user.id, cvsId);
                    yield messageService.createAsync({
                        from: user.id,
                        to: null,
                        channel: cvsId,
                        contentType: msg.MsgType,
                        content: msg.Content || null,
                        mediaId: msg.mediaId || null
                    });
                    customerEmitter.emit('message', cvs, msg);
                    customerEmitter.emit('conversation', cvs, msg);
                }
                else{
                    cvs = yield conversationService.loadByIdAsync(cvsId);//TODO should load cvs from redis
                    yield messageService.createAsync({
                        from: user.id,
                        to: null,
                        channel: cvsId,
                        contentType: msg.MsgType,
                        content: msg.Content || null,
                        mediaId: msg.mediaId || null
                    });
                    customerEmitter.emit('message', cvs, msg);
                }
            }catch(e){
                console.log(e.stack);
            }
        });
    });
};