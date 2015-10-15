
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

WechatSiteClient.prototype.subscribe = function(openid){
    this.openid = this.site.subscribe(this.client.user.getId(), openid);
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

WechatSiteClient.prototype.qrsubscribe = function(sceneId, openid){
    this.openid = this.site.qrsubscribe(sceneId, this.client.user.getId(), openid);
    this.enter();
};

WechatSiteClient.prototype.qrSCAN = function(sceneId){
    this.site.qrSCAN(sceneId, this.openid);
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
    var me = this;
    process.nextTick(function(){
        me.site.sendText(message);
    });
};

WechatSiteClient.prototype.sendImage = function(message){
    message.FromUserName = this.openid;
    var me = this;
    process.nextTick(function(){
        me.site.sendImage(message);
    });
};

WechatSiteClient.prototype.sendVoice = function(message){
    message.FromUserName = this.openid;
    var me = this;
    process.nextTick(function(){
        me.site.sendVoice(message);
    });
};

module.exports = WechatSiteClient;