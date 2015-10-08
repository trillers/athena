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

WechatClient.prototype.isSignedIn = function(){
    return this.signedIn;
};

WechatClient.prototype.getSignedInUser = function(){
    return this.user;
};

WechatClient.prototype.signin = function(username){
    var user = null;
    if(typeof username == 'string'){
        user = this.wechat.getUserByUsername(username);
    }
    else{
        user = username;
    }

    if(!user || !user.isRegistered()){
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

WechatClient.prototype.enterSite = function(siteId){
    var siteClient = this._getSiteClient(siteId);
    if(!siteClient) throw new Error('Site client ' +siteId + ' does not exist');
    siteClient.enter();

    return siteClient;
};

WechatClient.prototype.scanSite = function(siteId, sceneId, openid){
    var site = this.wechat.getSiteById(siteId);
    if(!site) throw new Error('wechat site ' +siteId+ ' does not exist');

    var openidSubscribed = site.getOpenid(this.user.getId());
    var siteClient = this._getSiteClient(site.getId());
    if(!siteClient){
        siteClient = this._createSiteClient(site);
    }

    if(sceneId && (site._isGeneratedSceneId(sceneId) || site._isGeneratedTempSceneId(sceneId))){ //has parameter
        if(openidSubscribed){
            siteClient.qrSCAN(sceneId);
        }
        else{
            siteClient.qrsubscribe(sceneId, openid);
        }
    }
    else{// no parameter
        if(openidSubscribed){
            siteClient.SCAN();
        }
        else{
            siteClient.subscribe(openid);
        }
    }

    return siteClient;
};

/**
 * assume that user select the wechat site and click subscribe button.
 * @param id wechat site id
 * @returns {WechatSiteClient|exports|module.exports}
 */
WechatClient.prototype.subscribeSite = function(siteId, openid){
    var site = this.wechat.getSiteById(siteId);
    if(!site) throw new Error('wechat site ' +siteId+ ' does not exist');

    var siteClient = this._createSiteClient(site);
    siteClient.subscribe(openid);

    return siteClient;
};

/**
 * @private
 * @param siteId
 * @returns {*}
 */
WechatClient.prototype._getSiteClient = function(siteId) {
    return this.sessions[siteId];
};

/**
 * @private
 * @param site
 * @returns {WechatSiteClient|exports|module.exports}
 */
WechatClient.prototype._createSiteClient = function(site) {
    var siteClient = new WechatSiteClient(site, this);
    this.sessions[site.getId()] = siteClient;
    return siteClient;
};

module.exports = WechatClient;