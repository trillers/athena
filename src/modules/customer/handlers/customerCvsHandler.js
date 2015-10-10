var cskv = require('../../cs/kvs/CustomerService');
var ConversationKv = require('../../conversation/kvs/Conversation');
var messageService = require('../../message/services/messageService');
var co = require('co');
var wechatApi = require('../../wechat/common/api').api;
module.exports = function(emitter){
    emitter.conversation(function(cvs, message){
        co(function*(){
            var cs;
            //get a free cs
            cs = yield cskv.popWcCSSetAsync();
            //if a free cs exist, assign to him
            if(cs){
                //create cid->cvsid
                yield ConversationKv.setCurrentCid(cs.id);
                //update cvs,
                cvs.csId = cs.id;
                yield ConversationKv.create(cvs);
                //get message from db, send the message
                var msgs = yield messageService.find({channel: cvs.id});
                msgs.forEach(function(msg){
                    _sendMsg(msg);
                })
            }else{
                //TODO if cs all busy
                console.log("all busy");
            }
        });
        function _sendMsg(msg){
            switch(msg.contentType){
                case 'text':
                    wechatApi.sendTextAsync(csId, msg.Content);
                    break;
                case 'image':
                    wechatApi.sendImageAsync(csId, msg.MediaId);
                    break;
                case 'voice':
                    wechatApi.sendVoiceAsync(csId, msg.MediaId);
                    break;
            }
        }
    })
};