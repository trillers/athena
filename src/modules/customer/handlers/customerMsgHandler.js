var co = require('co');
var wechatApi = require('../../wechat/common/api').api;
module.exports = function(emitter){
    emitter.message(function(cvs, message){
        var csId = cvs.csId;
        co(function*(){
            if(csId){
                //cvs is undertaken
                _sendMsg(message);
            }else{
                //cvs is applying, nothing to do
                console.log("message wait for queue");
            }
            function* _sendMsg(message){
                switch(message.MsgType) {
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
            }
        });
    })
};