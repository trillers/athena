var Service = {};
var proxy = require('../proxy/pub-sub');
/**
 * leverage sBot to send a msg to a user
 * @param msg:Object{ToUserName:String, MsgType:[text/voice/image], Content:String, Url:MediaUrl, MsgId:String}
 * @param callback
 * @return just original message
 */
Service.send = function(msg, callback){
    proxy.send(msg, callback);
};
/**
 * leverage sBot to read a user,s profile
 * @param bid:String
 * @param callback
 * @return { headUrl:[String],nickName:[String],bid:[String],place:[String]}
 */
Service.readProfile = function(bid, callback){
    proxy.readProfile(bid, callback);
};
/**
 * subscribe sBot receive event
 * @param callback
 */
Service.onReceive = function(callback){
    proxy.onReceive(callback);
};
/**
 * subscribe sBot addContact event
 * @param callback
 */
Service.onAddContact = function(callback){
    proxy.onAddContact(callback);
};
/**
 * subscribe sBot disconnect event
 * @param callback
 */
Service.onDisconnect = function(callback){
    proxy.onDisconnect(callback);
};
/**
 * subscribe sBot launch event
 * @param callback
 */
Service.onNeedLogin = function(callback){
    proxy.onNeedLogin(callback);
};
module.exports = Service;