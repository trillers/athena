var wechatApi = require('../../wechat/common/api').api;
var messageService = require('../../message/services/MessageService');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var userBizService = require('../../user/services/UserBizService')
var Promise = require('bluebird');
var _ = require('underscore')
var CSHandler = function(type, handle){
    this.type = type;
    this.handle = handle;
}

CSHandler.prototype.closeConversation = function(){

}
CSHandler.prototype.sendCustomerProfileAsync = Promise.promisify(sendCustomerProfile);
CSHandler.prototype.sendHistoryMsgsAsync = Promise.promisify(sendHistoryMsgs);
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
module.exports = CSHandler;