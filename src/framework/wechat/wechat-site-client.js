
/**
 * Wechat site client is a 订阅号/服务号 client which can interact with wechat user
 * @constructor
 */
var WechatSiteClient = function(site, client){
    this.site = site;
    this.client = client;
    this.messages = [];
    this.lastMessageSent = null;
    this.lastMessageReceived = null;
    this.openid = site.getOpenid(client.user.getId());
    this.open = false;
};

WechatSiteClient.prototype.getOpenid = function(){return this.openid;};

WechatSiteClient.prototype.subscribe = function(){
    this.site.subscribe(this.openid);
    this.enter();
};

WechatSiteClient.prototype.unsubscribe = function(){
    this.exit();
    this.site.unsubscribe(this.openid);
    this.site = null;
};

WechatSiteClient.prototype.SCAN = function(){
    this.site.SCAN(this.openid);
    this.enter();
};

WechatSiteClient.prototype.CLICK = function(key){
    this.site.CLICK(this.openid, key);
};

WechatSiteClient.prototype.VIEW = function(key){
    this.site.VIEW(this.openid, key);
};

WechatSiteClient.prototype.exit = function(){
    this.site.exit(this.openid);
    this.open = false;
};

WechatSiteClient.prototype.send = function(message){
    message.FromUserName = this.openid;
    //message.ToUserName = this.openid;
    this.site.onReceive(message);
};

WechatSiteClient.prototype.message = function(handler){

};

WechatSiteClient.prototype.onReceive = function(message){

};

module.exports = WechatSiteClient;