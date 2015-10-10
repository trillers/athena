var cskv = require('../../cs/kvs/CustomerService');
var ConversationKv = require('../../conversation/kvs/Conversation');
var messageService = require('../../message/services/MessageService');
var conversationService = require('../../conversation/services/ConversationService');
var userService = require('../../user/services/UserService');
var co = require('co');
var wechatApi = require('../../wechat/common/api').api;
module.exports = function(emitter){
    emitter.conversation(function(cvs, message){
        co(function*(){
            var cid;
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
                    //get message from db, send the message
                    var msgs = yield messageService.findAsync({channel: cvs.id});
                    yield conversationService.updateAsync(cvs.id, {csId: cid});
                    var user = yield userService.loadByIdAsync(cid);
                    console.log("======================");
                    console.log(user);
                    msgs.forEach(function(msg){
                        _sendMsg(user.wx_openid, msg);
                    })
                }else{
                    //TODO if cs all busy
                    console.log("all busy");
                }
            }catch(e){
                console.log(e);
            }
        });
        function _sendMsg(openid, msg){
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&");
            console.log(msg);
            switch(msg.contentType){
                case 'text':
                    wechatApi.sendTextAsync(openid, msg.content);
                    break;
                case 'image':
                    wechatApi.sendImageAsync(openid, msg.mediaId);
                    break;
                case 'voice':
                    wechatApi.sendVoiceAsync(openid, msg.mediaId);
                    break;
            }
        }
    })
};