var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var UserKv = require('../../user/kvs/User');
var wechatUserService = require('../../../../src/modules/user/services/WechatUserService');
var userService = require('../../../../src/modules/user/services/UserService');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var csState = require('../../common/models/TypeRegistry').item('CSState');
var cvsKvs = require('../../conversation/kvs/Conversation');
var cvsService = require('../../conversation/services/ConversationService');
var csKvs = require('../../cs/kvs/CustomerService');
var Service = {};

/**
 * Create an bot user from openid
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
            console.error('BotService createFromOpenId err:' + err);
            if(callback) callback(err, null);
        }

    });
};

/**
 * Set user role to bot role by openid
 * @param openid
 * @param callback
 */
Service.setRoleByOpenid = function(openid, callback){
    co(function*(){
        var userUpdate = {
            role: UserRole.Bot.value()
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
            if(callback) callback(null, user);
        } catch (err){
            logger.error('AdminService setRoleByOpenid err:' + err);
            if(callback) callback(err, null);
        }
    });
};

Service = Promise.promisifyAll(Service);
module.exports = Service;