var co = require('co');
var conversationService = require('../../conversation/services/ConversationService');
var messageService = require('../../message/services/MessageService')
var ConversationKv = require('../../conversation/kvs/Conversation');
var customerEmitter = require('../customerEmitter');
module.exports = function(emitter){
    emitter.customer(function(event, context){
        co(function* (){
            try{
                var user = yield context.getUser();
                context.user = user;
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
                        mediaId: msg.MediaId || null,
                        recognition: msg.Recognition || null
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
                        mediaId: msg.MediaId || null,
                        recognition: msg.Recognition || null
                    });
                    customerEmitter.emit('message', cvs, msg);
                }
            }catch(e){
                console.log(e.stack);
            }
        });
    });
};