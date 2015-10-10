var co = require('co');
var wechatApi = require('../../wechat/common/api').api;
var userService = require('../../user/services/UserService');
module.exports = function(emitter){
    emitter.message(function(cvs, message){
        console.log("*********************");
        console.log(cvs);
        var csId = cvs.csId;
        console.log(csId);
        co(function*(){
            if(csId){
                //cvs is undertaken
                var user = yield userService.loadById(csId);
                yield _sendMsg(user.wx_openid, message);
            }else{
                //cvs is applying, nothing to do
                console.log("message wait for queue");
            }
            function* _sendMsg(openId, message){
                console.log("---------------");
                console.log(message)
                switch(message.MsgType) {
                    case 'text':
                        yield wechatApi.sendTextAsync(openId, message.Content);
                        break;
                    case 'image':
                        yield wechatApi.sendImageAsync(openId, message.MediaId);
                        break;
                    case 'voice':
                        yield wechatApi.sendVoiceAsync(openId, message.MediaId);
                        break;
                }
            }
        });
    })
};