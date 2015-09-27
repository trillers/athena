var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var WechatAuthenticator = require('../../user/services/WechatAuthenticator');
var authenticator = new WechatAuthenticator({});
var RoleEmitter = require('../RoleEmitter');
var roleEmitter = new RoleEmitter();
require('../../cs/handlers/CsHandler')(roleEmitter);
require('../../admin/handlers/AdminHandler')(roleEmitter);
require('../../customer/handlers/CustomerHandler')(roleEmitter);

module.exports = function(emitter){
    emitter.qr(function(event, context){
        authenticator.ensureSignin(context.weixin, context, function(err, user){
            if(err){
                logger.error('Fail to sigin with user: ' + err);
            }
            else{
                context.user = user;
            }
           //TODO: CODE HERE
        });
    });
};