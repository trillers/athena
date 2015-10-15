/**
 * Wechat User is a wechat user information wrapper
 * @constructor
 */
var WechatUser = function(info){
    var errors = [];

    info.username || (errors.push('need username'));
    info.nickname || (errors.push('need nickname'));

    if(errors.length != 0){
        throw new Error(errors.join('\r\n'));
    }

    this.info = {
        username: info.username,
        nickname: info.nickname,
        headimgurl: info.headimgurl || 'http://www.jf258.com/uploads/2014-03-30/233454270.jpg', //in case of no icon, use default icon
        registered: false
    };
};
WechatUser.prototype.getJson = function(){return this.info};
WechatUser.prototype.getId = function(){return this.info.id;};
WechatUser.prototype._setId = function(id){this.info.id = id;};
WechatUser.prototype.getUsername = function(){return this.info.username;};
WechatUser.prototype.setUsername = function(username){this.info.username = username;};
WechatUser.prototype.getNickname = function(){return this.info.nickname;};
WechatUser.prototype.setNickname = function(nickname){this.info.nickname = nickname;};
WechatUser.prototype.getHeadimgurl = function(){return this.info.headimgurl;};
WechatUser.prototype.setHeadimgurl = function(headimgurl){this.info.headimgurl = headimgurl;};
WechatUser.prototype.isRegistered = function(){return this.info.registered};
WechatUser.prototype._setRegistered = function(registered){this.info.registered = registered;};

module.exports = WechatUser;