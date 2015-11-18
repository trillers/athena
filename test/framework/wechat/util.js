var Wechat = require('../../../src/framework/wechat/index');

var _ids = {};
var nextSeq = function(key){
    if(!_ids[key]){
        _ids[key] = 0;
    }

    return ++_ids[key];
};

var Util = {};

Util.newUserInfo = function(){
    var userInfo = {};
    var no = nextSeq('user');
    userInfo.username = 'user_' + no;
    userInfo.nickname = 'User ' + no;
    return userInfo;
};
Util.newRegisteredUser = function(platform){
    return platform.registerUser(Util.newUserInfo());
};

Util.newCreatedClient = function(platform, config){
    return platform.createClient(config||{});
};

Util.newSignedInClient = function(platform, config){
    var client = platform.createClient(config||{});
    var user = platform.registerUser(Util.newUserInfo());
    client.signin(user.getUsername());
    return client;
};

Util.newRegisteredSite = function(platform, siteId){
    var no = nextSeq('site');
    var siteInfo = {};
    siteInfo.code = 'site_' + no;
    siteInfo.name = 'Site ' + no;
    siteInfo && (siteInfo.id = siteId);

    return platform.registerSite(siteInfo);
};

module.exports = Util;