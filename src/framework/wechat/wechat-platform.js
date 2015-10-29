var WechatUser = require('./wechat-user');
var WechatClient = require('./wechat-client');
var WechatSite = require('./wechat-site');

var Platform = function(){
    this.users = {}; //user map, key is user id, value is WechatUser object
    this.usernameUsers = {}; //user map, key is username, value is WechatUser object
    this.sites = {}; //site map, key is wechat site id, value is WechatSite object
    this.codeSites = {}; //site map, key is wechat site code, value is WechatSite object
    this.qrcodeSites = {}; //site map, key is wechat site qrcode, value is WechatSite object

    this._ids = {};
};

Platform.prototype.registerUser = function(info){
    if(this.getUserByUsername(info.username)){
        throw new Error('wechat user '+info.username+' exists');
    }

    var user = new WechatUser(info);
    user._setId(this._nextId('user'));
    this.users[user.getId()] = user;
    this.usernameUsers[user.getUsername()] = user;
    user._setRegistered(true); //flag user as registered in wechat

    return user
};

Platform.prototype.getUserById = function(id){return this.users[id];};
Platform.prototype.getUserByUsername = function(username){return this.usernameUsers[username];};
Platform.prototype.createClient = function(config){return new WechatClient(this, config);};
Platform.prototype.registerSite = function(info){
    if(this.getSiteByCode(info.code)){
        throw new Error('wechat site '+info.num+' exists');
    }

    var site = new WechatSite(this, info);
    site._setQrcode(this._nextId('site_client'));
    this.sites[site.getId()] = site;
    this.codeSites[site.getCode()] = site;
    this.qrcodeSites[site.getQrcode()] = site;

    site._setRegistered(true); //flag site as registered in wechat

    return site;
};
Platform.prototype.getSiteById = function(id){return this.sites[id];};
Platform.prototype.getSiteByCode = function(code){return this.codeSites[code];};
Platform.prototype.getSiteByQrcode = function(qrcode){return this.qrcodeSites[qrcode];};


Platform.prototype._nextId = function(key){
    if(!this._ids[key]){
        this._ids[key] = 0;
    }

    return key + '_id_' + ++ this._ids[key];
};

module.exports = Platform;