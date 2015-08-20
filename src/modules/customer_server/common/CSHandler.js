var wechatApi = require('../../wechat/common/api').api;
var messageService = require('../../message/services/MessageService');
var userService = require('../../user/services/UserService')
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
function sendCustomerProfile(customerId, callback){
    var userdoc;
    var params = {
        conditions: {
            wx_openid: customerId
        }
    }
    userService.filterAsync(params)
        .then(function(user){
            userdoc = _.pick(user);
            return wechatApi.sendTextAsync(conversation.csId, item.content)
        })
        .then(function(){
            callback(null, userdoc);
        })
        .catch(function(){
            callback(new Error('Failed to send user profile'), null);
        })
}
function sendHistoryMsgs(conversation, callback){
    var params = {
        conditions: {
            channel: conversation._id
        }
    }
    messageService.filterAsync(params)
    .then(function(docs){
        var promiseArr = [];
        docs.forEach(function(item){
            promiseArr.push(wechatApi['send' + _firstCharUpper(item.contentType) + 'Async'](conversation.csId, item.content))
        })
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