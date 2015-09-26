var Service = {};
var proxy = require('../proxy/pub-sub');
/**
 * leverage sBot to send a msg to a user
 * @param msg:Object{ToUserName:String, MsgType:'text/voice/image', Content:String, Url:MediaUrl, MsgId:String}
 * @param callback
 */
Service.send = function(msg, callback){
    proxy.send(msg, callback);
};
/**
 * leverage sBot to read user,s profile
 * @param bid:String
 * @param callback
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
module.exports = Service;