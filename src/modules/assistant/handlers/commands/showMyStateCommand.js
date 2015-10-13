var wechatApi = require('../../../wechat/common/api').api;
var userRole = require('../../../common/models/TypeRegistry').item('UserRole');
emitter.status(function(context){
    var message = context.weixin;
    var user = context.user;
    var reply = '';
    //response [系统]:您的当前状态为-在线-会话中
    co(function* (){
        try {
            var user = context.getUser();
            if(user.role != userRole.CustomerService.values()){
                reply = '[系统]:您的角色为' + userRole.CustomerService.;
                yield wechatApi.sendTextAsync(message.FromUserName, '[系统]:您的当前状态为' + csState.values(user.status));
            }else{
                var stat = yield cskv.loadCSStatusByCSOpenIdAsync(message.FromUserName);
                yield wechatApi.sendTextAsync(message.FromUserName, '[系统]:您的当前状态为' + csState.values(user.status));
            }
        }catch(e){
            console.log(e);
        }
    })
})