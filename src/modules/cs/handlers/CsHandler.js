var MessageService = require('../../message/services/MessageService');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var cskv = require('../kvs/CustomerService');
var caseCarHandler = require('./cases/caseCarHandler');
var caseCoffeeHandler = require('./cases/caseCoffeeHandler');
var co = require('co');
var Promise = require('bluebird');
var command = require('./commands');
var wechatApi = require('../../wechat/common/api').api;
var caseType = {
    'car':caseCarHandler,
    'co':caseCoffeeHandler
}
var cmdWorkflow = require('../common/FSM').getWf('cmdWorkflow');
var handle = function(user, message){
    var stt;
    cskv.loadCSStatusByCSOpenIdAsync(user.wx_openid)
        .then(function(st){
            stt = st || 'off';
            user.status = stt;
            return cskv.loadPlaceCaseAsync(user.wx_openid)
        })
        .then(function(data){
            if(data){
                caseType[data['payload'].type](data, user, message);
                return Promise.reject(new Error('isCase'));
            }
            return;
        })
        .then(function(){
            var com = command.getCommand(message);
            if(com) {
                if(cmdWorkflow.canInWild(command.getActionName(com.action), stt)){
                    var executeFn = command.commandHandler(com.action);
                    executeFn(user, com.arg, function(err, data){
                        console.log(com.action + 'command finish');
                        if(!err){
                            var status = cmdWorkflow.transition(command.getActionName(com.action), stt)
                            cskv.saveCSStatusByCSOpenIdAsync(user.wx_openid, status)
                                .then(function(){
                                    return cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid);
                                });
                        }
                    });
                    return Promise.reject(new Error('isCmd'));
                }else{
                    wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前状态不能执行该操作');
                    return Promise.reject(new Error('illegalOperation'));
                }
            }
        })
        .then(function(){
            return cskv.loadCSSByIdAsync(user.wx_openid)
        })
        .then(function(data){
            if(data){
                var customer = data.initiator;
                var msg = {
                    from: user.wx_openid,
                    to: customer,
                    contentType: MsgContentType.names(message.MsgType),
                    content: message.Content || message.MediaId,
                    channel: data._id
                }
                co(function* (){
                    yield MessageService.createAsync(msg);
                    switch(message.MsgType){
                        case 'text':
                            yield wechatApi.sendTextAsync(customer, message.Content);
                            break;
                        case 'image':
                            yield wechatApi.sendImageAsync(customer, message.MediaId);
                            break;
                        case 'voice':
                            yield wechatApi.sendVoiceAsync(customer, message.MediaId);
                            break;
                    }
                })
            }else{
                return wechatApi.sendTextAsync(user.wx_openid, '[系统]:您还没有建立会话');
            }
        })
        .then(function(){
            return cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid);
        })
        .catch(function(err){
            if(err && err.message != 'isCase' && err.message != 'isCmd' &&err.message != 'illegalOperation') console.log(err);
        })
}

function sendCustomerProfile(conversation, callback){
    var userdoc;
    userBizService.loadByOpenidAsync(conversation.initiator)
        .then(function(user){
            userdoc = _.pick(user, 'nickName', 'phone');
            var res = '客户信息——————————————\n'+
                '客户昵称：'+ (userdoc.nickName || '匿名') + '\n' +
                '手机号码：'+ userdoc.phone;
            return wechatApi.sendTextAsync(conversation.csId, res)
        })
        .then(function(){
            callback(null, userdoc);
        })
        .catch(function(){
            callback(new Error('Failed to send user profile'), null);
        })
}
function sendHistoryMsgs(conversation, callback){
    var msgs = []
    var params = {
        conditions: {
            channel: conversation._id
        }
    }
    messageService.filterAsync(params)
        .then(function(docs){
            msgs = docs;
            return wechatApi.sendTextAsync(conversation.csId, '您已连接新客户=========')
        })
        .then(function(){
            var promiseArr = [];
            for(var i=0,len=msgs.length;i<len;i++){
                var item = msgs[i];
                promiseArr.push(wechatApi['send' + _firstCharUpper(MsgContentType.valueNames(item.contentType)) + 'Async'](conversation.csId, item.content))
            }
            Promise.all(promiseArr).then(function(){
                console.log('Succeed to send history message')
                callback(null, null)
            }).catch(function(){
                callback(new Error('Failed to send history message'), null)
            })
        })
}
function _firstCharUpper(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports = function(emitter){
    emitter.cs(function(event, context){
        console.log('emit customer service handler');
        var user = context.user;
        var msg = context.weixin;
        handle(user, msg);
    });
};

module.exports.sendCustomerProfileAsync = Promise.promisify(sendCustomerProfile);
module.exports.sendHistoryMsgsAsync = Promise.promisify(sendHistoryMsgs);