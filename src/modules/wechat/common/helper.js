var Promise = require('bluebird');

var helper = {};

/**
 * 直辖市列表
 */
var  directCities = {
    '北京': true,
    '天津': true,
    '上海': true,
    '重庆': true
};
helper.directCities = directCities;

helper.copyLocation = function(dest, src){
    dest.country = src.country;
    dest.province = src.province;
    if(directCities[src.province]){
        dest.city = src.province;
        dest.district = src.city;
    }
    else{
        dest.city = src.city;
    }
};

helper.copyUserInfo = function(dest, src){
    dest.openid   = src.openid;
    dest.nickname   = src.nickname;
    dest.headimgurl = src.headimgurl;
    dest.sex        = src.sex;

    helper.copyLocation(dest, src);
    src.language && (dest.language = src.language);
    src.remark   && (dest.remark = src.remark);
};

helper.getUserInfo = function (api, openid, language, callback) {
    var input = {openid: openid, lang: language};
    api.getUser(input, function (err, userInfo) {
        if (err) {
            if (callback) callback(err);
        }
        else {
            if (callback) callback(null, userInfo);
        }
    });
};
helper.getUserInfoAsync = Promise.promisify(helper.getUserInfo);

module.exports = helper;