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

var commands = {};
commands['删除当前用户'] = require('./commands/deleteUserCommand');

var getCommandHandler = function(msg){
    return 'text' == msg.MsgType && commands[msg.Content];
};

module.exports = function(emitter){
    emitter.message(function(event, context){
        var msg = context.weixin;
        authenticator.ensureSignin(context.weixin, context, function(err, user){
            if(err){
                logger.error('Fail to sigin with user: ' + err);
            }
            else{
                context.user = user;
            }

            var handler = getCommandHandler(msg);
            if(handler){
                handler(msg, user);
            }
            else{
                roleEmitter.emit(context);
            }
        });
    });
};