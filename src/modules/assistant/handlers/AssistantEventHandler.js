var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var WechatAuthenticator = require('../../user/services/WechatAuthenticator');
var authenticator = new WechatAuthenticator({});

module.exports = function(emitter){
    emitter.subscribe(function(event, context){
        authenticator.ensureSignin(context.weixin, context, function(err, user){
            if(err){
                logger.error('Fail to sign up: ' + err);
                logger.error(context.weixin);
            }
            else{
                context.user = user;
                console.log('sign up a customer user automatically');
            }
        });
    });

    emitter.qr(function(event, context){
        authenticator.ensureSignin(context.weixin, context, function(err, user){
            if(err){
                logger.error('Fail to sigin with user: ' + err);
            }
            else{
                context.user = user;
                //TODO: CODE HERE
                console.log('sign up a customer service user automatically');
            }
        });
    });
};