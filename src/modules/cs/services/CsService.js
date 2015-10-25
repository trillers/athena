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
var csState = require('../../common/models/TypeRegistry').item('CSState');
var csKvs = require('../kvs/CustomerService');
var cvsKvs = require('../../conversation/kvs/Conversation');
var cvsService = require('../../conversation/services/ConversationService');

var Service = {};

/**
 * Create a customer service user from openid
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
 * Set user role to customer service role by openid
 * @param openid
 * @param callback
 */
Service.setRoleByOpenid = function(openid, callback){
    co(function*(){
        var userUpdate = {
            role: UserRole.CustomerService.value(),
            setRoleTime: new Date()
        };
        try{
            var userId = yield UserKv.loadIdByOpenidAsync(openid);
            var user = yield userService.updateAsync(userId, userUpdate);
            var csCvsId = yield cvsKvs.getCurrentCidAsync(userId);
            var cuCvsId = yield cvsKvs.getCurrentIdAsync(userId);
            var cvsId = csCvsId || cuCvsId;
            console.log('********');
            console.log('cvsId' + cvsId);
            if(cvsId){
                var cvs = yield cvsKvs.loadByIdAsync(cvsId);
                console.log(cvs);
                yield cvsService.closeAsync(cvs);
            }
            yield csKvs.remWcCSSetAsync(userId);
            yield csKvs.delCSStatusByCSOpenIdAsync(openid);
            yield csKvs.saveCSStatusByCSOpenIdAsync(openid, csState.offline.value());
            if(callback) callback(null, user);
        } catch (err){
            console.log(err.stack);
            logger.error('CustomerService setRoleByOpenid err:' + err);
            if(callback) callback(err, null);
        }
    });
};

Service = Promise.promisifyAll(Service);
module.exports = Service;