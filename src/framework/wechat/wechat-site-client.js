
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
    this.openid = this.site.subscribe(this.client.user.getId());
    this.enter();
};

WechatSiteClient.prototype.unsubscribe = function(){
    this.exit();
    this.site.unsubscribe(this.openid);
    this.site = null;
};

WechatSiteClient.prototype.SCAN = function(){
    this.site.SCAN(this.openid);
    this.site.enter();
};

WechatSiteClient.prototype.CLICK = function(key){
    this.site.CLICK(this.openid, key);
};

WechatSiteClient.prototype.VIEW = function(key){
    this.site.VIEW(this.openid, key);
};

WechatSiteClient.prototype.enter = function(){
    this.site.enter(this.openid);
    this.open = true;
};

WechatSiteClient.prototype.exit = function(){
    this.site.exit(this.openid);
    this.open = false;
};

WechatSiteClient.prototype.sendText = function(message){
    message.FromUserName = this.openid;
    this.site.sendText(message);
};

WechatSiteClient.prototype.sendImage = function(message){
    message.FromUserName = this.openid;
    this.site.sendImage(message);
};

WechatSiteClient.prototype.sendVoice = function(message){
    message.FromUserName = this.openid;
    this.site.sendVoice(message);
};

module.exports = WechatSiteClient;