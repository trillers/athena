var Promise = require('bluebird');
var UserKv = require('../../user/kvs/User');
var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var wechat = require('../../wechat/common/api');
var cbUtil = require('../../../framework/callback');
var co = require('co');
var wechatUserService = require('../../../../src/modules/user/services/WechatUserService');
var userService = require('../../../../src/modules/user/services/UserService');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var Service = {};

/**
 * Create a customer user from openid
 * @param openid
 * @param callback
 */
Service.createFromOpenid = function(openid, callback){
    var self = this;
    co(function*(){
        try{
            var loadOrCreateFromWechatAsync = Promise.promisify(wechatUserService.loadOrCreateFromWechat);
            var user = yield loadOrCreateFromWechatAsync(openid);
            var newUser = yield self.setRoleByOpenidAsync(openid);
            if(callback) callback(null, newUser);
        } catch (err){
            console.error('CustomerService createFromOpenId err:' + err);
            if(callback) callback(err, null);
        }

    });
};

/**
 * Set user role to customer role by openid
 * @param openid
 * @param callback
 */
Service.setRoleByOpenid = function(openid, callback){
    co(function*(){
        var userUpdate = {
            role: UserRole.Customer.value()
        };
        try{
            var userId = yield UserKv.loadIdByOpenidAsync(openid);
            var user = yield userService.updateAsync(userId, userUpdate);
            if(callback) callback(null, user);
        } catch (err){
            logger.error('CustomerService setRoleByOpenid err:' + err);
            if(callback) callback(err, null);
        }
    });
};

Service = Promise.promisifyAll(Service);
module.exports = Service;