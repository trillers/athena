var WechatSiteClient = require('./wechat-site-client');
/**
 * Wechat Client is a wechat user's agent which interact with wechat ecosystem
 * acting as wechat app running in user's smart phone.
 * @constructor
 */
var WechatClient = function(wechat, config){
    this.wechat = wechat;
    this.config = config;
    this.user = null;
    this.signedIn = false;
    this.contacts = {};
    this.sessions = {};
};

WechatClient.prototype.signin = function(username){
    var user = null;
    if(typeof username == 'string'){
        user = this.wechat.getUserByUsername(username);
    }
    else{
        user = username;
    }

    if(!user || !user.getRegistered()){
        return null;
    }

    this.user = user;
    this.signedIn = true;
    return user;
};

WechatClient.prototype.signout = function(){
    if(!this.signedIn) return;
    this.user = null;
    this.signedIn = false;
};

WechatClient.prototype.enterSite = function(id){
    var siteClient = this.getSiteClient(site.getId());
    if(!siteClient) throw new Error('Site client ' +id+ + ' does not exist');
    siteClient.enter();

    return siteClient;
};

WechatClient.prototype.scanSite = function(qrcode){
    var site = this.wechat.getSiteByQrcode(qrcode);

    /*
     * TODO find by parameterized qrcode here
     */

    if(!site) return null;

    var siteClient = this.getSiteClient(site.getId());
    if(siteClient){
        siteClient.SCAN();
    }
    else{
        siteClient = this.createSiteClient(site);
        siteClient.subscribe();
    }

    return siteClient;
};

/**
 * assume that user select the wechat site and click subscribe button.
 * @param id wechat site id
 * @returns {WechatSiteClient|exports|module.exports}
 */
WechatClient.prototype.subscribeSite = function(id){
    var site = this.wechat.getSiteById(id);
    if(!site) throw new Error('wechat site ' +id+ ' does not exist');

    var siteClient = this.createSiteClient(site);
    siteClient.subscribe();

    return siteClient;
};

/**
 * @private
 * @param siteId
 * @returns {*}
 */
WechatClient.prototype.getSiteClient = function(siteId) {
    return this.sessions[siteId];
};

/**
 * @private
 * @param site
 * @returns {WechatSiteClient|exports|module.exports}
 */
WechatClient.prototype.createSiteClient = function(site) {
    var siteClient = new WechatSiteClient(site, this);
    this.sessions[site.getId()] = siteClient;
    return siteClient;
};

module.exports = WechatClient;