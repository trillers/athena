var co = require('co');
var cskv = require('../../cs/kvs/CustomerService');
var ConversationKv = require('../../conversation/kvs/Conversation');
var messageService = require('../../message/services/MessageService');
var conversationService = require('../../conversation/services/ConversationService');
var userService = require('../../user/services/UserService');
var wechatApi = require('../../wechat/common/api').api;
module.exports = function(emitter){
    emitter.botCvs(function(cvs, message){
        co(function*(){
            var cid = null;
            try{
                //get a free cs
                cid = yield cskv.popWcCSSetAsync();
                //if a free cs exist, assign to him
                if(cid){
                    //create cid->cvsid
                    yield ConversationKv.setCurrentCidAsync(cid, cvs.id);
                    //update cvs,
                    cvs.csId = cid;
                    yield ConversationKv.createAsync(cvs);
                    //notify customer
                    var customer = yield userService.loadByIdAsync(cvs.initiator);
                    var cs = yield userService.loadByIdAsync(cid);
                    //send the customer,s profile to cs
                    yield _sendMsg(cs.wx_openid, {contentType: 'text', content: '[系统]: 您正在为“'+ customer.nickname +'”服务'});
                    //get historical messages from db, send them
                    var msgs = yield messageService.findAsync({conditions:{channel: cvs.id}});
                    yield conversationService.updateAsync(cvs.id, {csId: cid, takenTime: new Date()});
                    for(var i=0, len=msgs.length; i<len; i++){
                        yield _sendMsg(cs.wx_openid, msgs[i]);
                    }
                }else{
                    //if cs all busy? clear trace
                    yield conversationService.deleteAsync(cvs._id);
                    yield ConversationKv.delByIdAsync(cvs._id);
                    yield ConversationKv.delCurrentIdAsync(cvs.initiator);
                }
            }catch(e){
                console.log(e);
            }
            function* _sendMsg(openid, msg){
                switch(msg.contentType){
                    case 'text':
                        yield wechatApi.sendTextAsync(openid, msg.content);
                        break;
                    case 'image':
                        yield wechatApi.sendImageAsync(openid, msg.wx_media_id);
                        break;
                    case 'voice':
                        yield wechatApi.sendVoiceAsync(openid, msg.wx_media_id);
                        if(msg.recognition){
                            yield wechatApi.sendTextAsync(openid, '[翻译]: ' + msg.recognition);
                        }
                        break;
                }
            }
        });
    })
};