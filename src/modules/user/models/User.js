var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var UserState = require('../../../framework/model/enums').UserState;
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');

var _ = require('underscore');

var schema = DomainBuilder
    .i('User')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        token: {type: String}
        , stt: {type: String, enum: UserState.values(), required: true}
        , role: {type: String, enum: UserRole.valueList(), default: UserRole.RegularUser.value()}
        //, tag: [{type: String, ref: 'Tag'}]

        , wx_openid: {type: String} //weixin openid
        , wx_at: String //weixin access_token
        , wx_rt: String //weixin refresh_token
        , wx_scope: String //weixin oauth scope

        , wx_subscribe: {type: Number, default: 0}
        , wx_subscribe_time: {type: Date}
        , subscribeCount: {type: Number, default: 0} // how many times does the user subscribe on seedtrip wechat

        , wx_nickname: String
        , wx_sex: {type: Number, default: 0}
        , wx_headimgurl: {type: String}
        , wx_language: {type: String} //newly added
        , wx_remark: {type: String} //newly added

        , wx_country: {type: String}
        , wx_province: {type: String}
        , wx_city: {type: String}
        , wx_privilege: {type: String}
    })
    .build();

var helper = {};
/**
 * Get user json object from mongoose user document
 * @param user
 */
helper.getUserJsonFromModel = function(user) {
    var userJson = user.toObject({virtuals: true});
    userJson.id = user.id;
    userJson.contact && (delete userJson.contact);
    return userJson;
};

/**
 * Get user json object from wechat api
 * @param userInfo
 * @param oauth
 */
helper.getUserJsonFromWechatApi = function(userInfo, oauth){
    var json = {

        /*
         * shared properties from wechat or other platforms
         */
        displayName:       userInfo.nickname,
        headImgUrl:        userInfo.headimgurl,

        /*
         * wechat oauth info
         */
        wx_openid:         oauth && oauth.openid || userInfo.openid,
        wx_at:             oauth && oauth.access_token || userInfo.access_token,
        wx_rt:             oauth && oauth.refresh_token || userInfo.refresh_token,
        wx_scope:          oauth && oauth.scope || userInfo.scope,

        wx_subscribe:      userInfo.subscribe,
        wx_subscribe_time: userInfo.subscribe_time,

        //channelFrom:     //TODO: update sceneId here
        //subscribeCount:  //TODO: $incr 1

        wx_nickname:       userInfo.nickname,
        wx_headimgurl:     userInfo.headimgurl,
        wx_sex:            userInfo.sex,
        wx_language:       userInfo.language,
        wx_remark:         userInfo.remark,

        wx_country:        userInfo.country,
        wx_province:       userInfo.province,
        wx_city:           userInfo.city,
        wx_privilege:      userInfo.privilege || null
    };

    //convert "subscribe time" from timestamp to date object
    var subscribe_time = null;
    if(userInfo.subscribe_time){
        subscribe_time = new Date();
        subscribe_time.setTime(json.wx_subscribe_time*1000);
    }
    json.wx_subscribe_time = subscribe_time;

    return json;
};

var oauth_result_fields =    ['openid', 'unionid', 'scope', 'access_token', 'expires_in', 'refresh_token'];
var sns_userinfo_fields =    ['openid', 'unionid', 'nickname', 'headimgurl', 'sex', 'country', 'province', 'city', 'privilege'];
var global_userinfo_fields = ['openid', 'unionid', 'nickname', 'headimgurl', 'sex', 'country', 'province', 'city'
    ,'subscribe' ,'subscribe_time' ,'language'];

var union_fields = _.union(oauth_result_fields, sns_userinfo_fields, global_userinfo_fields);
var replace_fields = {
    'access_token': 'wx_at',
    'refresh_token': 'wx_rt',
    'expires_in': 'wx_expires'
};

var alias_fields = {
    'nickname': 'displayName',
    'headimgurl': 'headImgUrl'
};

/**
 * merge user json from snsapi_base and snsapi_userinfo and global getuser
 * @param snsUserInfo
 * @param globalUserInfo
 * @return {object} userInfo merged
 */
helper.mergeUserInfo = function(snsUserInfo, globalUserInfo){
    var userInfo = {};
    var fullUserInfo = _.clone(snsUserInfo);
    fullUserInfo = _.extend(fullUserInfo, globalUserInfo);

    union_fields.forEach(function(name, i, list){
        var replace_name = replace_fields[name];
        if(replace_name){
            userInfo[replace_name] = fullUserInfo[name];
        }
        else{
            var alias_name = alias_fields[name];
            if(alias_name){
                userInfo[alias_name] = fullUserInfo[name];
            }

            userInfo['wx_' + name] = fullUserInfo[name];
        }
    });


    //convert 'privilege' from array to comma-delimiter string
    if(userInfo.wx_privilege && typeof userInfo.wx_privilege == 'array'){
        userInfo.wx_privilege = userInfo.wx_privilege.split(',');
    }
    else{
        userInfo.wx_privilege = '';
    }

    //convert "subscribe time" from timestamp to date object
    var subscribe_time = null;
    if(userInfo.subscribe_time){
        subscribe_time = new Date();
        subscribe_time.setTime(userInfo.wx_subscribe_time*1000);
    }
    userInfo.wx_subscribe_time = subscribe_time;

    console.log('============= merged userinfo =================');
    console.log(userInfo);
    return userInfo;
};


module.exports.schema = schema;
module.exports.model = schema.model(true);
module.exports.helper = helper;
