var wechatApi = require('../../../wechat/common/api').api;
var userRole = require('../../../common/models/TypeRegistry').item('UserRole');
var csState = require('../../../common/models/TypeRegistry').item('CSState');
var cskv = require('../../../cs/kvs/CustomerService');
var cvsKv = require('../../../conversation/kvs/Conversation');
var userService = require('../../../user/services/UserService');
var co = require('co');
module.exports = function(context){
    var message = context.weixin;
    var reply = '';
    //response [系统]:您的当前状态为-在线-会话中
    co(function* (){
        try {
            var user = yield context.getUser();
            var customer = null;
            reply = '[系统]: 您的角色为' + userRole.values(user.role);
            if(user.role === userRole.CustomerService.value()){
                var stat = yield cskv.loadCSStatusByCSOpenIdAsync(message.FromUserName);
                var cvsId = yield cvsKv.getCurrentCidAsync(user.id);
                if(typeof stat === 'string'){
                    reply += ', 当前状态为: ' + csState.values(stat);
                }
                else{
                    reply += ', 当前状态为: ' + csState.offline.title();
                }
                if(cvsId){
                    var cvs = yield cvsKv.loadByIdAsync(cvsId);
                    if(!cvs){
                        throw new Error('show my state error occur');
                    }
                    customer = yield userService.loadByIdAsync(cvs.initiator);
                    reply += ', 与"' + customer.nickname + '"会话中…';
                }else{
                    reply += ', 无会话';
                }
            }
            if(user.role == userRole.Customer.value()){
                var cvsId = yield cvsKv.getCurrentIdAsync(user.id);
                if(cvsId){
                    reply += ', 会话中';
                }else{
                    reply += ', 无会话';
                }
            }
            yield wechatApi.sendTextAsync(message.FromUserName, reply);
        }catch(e){
            console.log(e);
        }
    })
};