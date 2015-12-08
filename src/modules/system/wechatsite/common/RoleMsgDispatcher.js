var EventEmitter = require('events').EventEmitter;
var logger = require('../../../../app/logging').logger;
var TenantMemberRole = require('../../../common/models/TypeRegistry').item('TenantMemberRole');

var RoleMsgDispatcher = function(){
    this.emitter = new EventEmitter();
};

/**
 * TODO
 * @param context
 */
RoleMsgDispatcher.prototype.emit = function(context){
    var self = this;
    context.getUser().then(function(user){
        logger.debug(user);
        var post = null;
        if(user && user.posts && user.posts.length>0){
            post = user.posts[0]; 
        }
        
        if(post){ //for platform and regular tenant users
            if(user.role == TenantMemberRole.TenantOperation.value()){
                self.emitter.emit('to', 'to', context);
            }
            else if(user.role == TenantMemberRole.TenantAdmin.value()){
                self.emitter.emit('ta', 'ta', context);
            }
            else if(post.role == TenantMemberRole.PlatformOperation.value()){
                self.emitter.emit('po', 'po', context);
            }
            else if(user.role == TenantMemberRole.PlatformAdmin.value()){
                self.emitter.emit('pa', 'pa', context);
            }
            else{
                //for other unknown roles, ignore it
            }
        }
        else{ //for guest users
            self.emitter.emit('guest', 'guest', context);
        }
    }).catch(Error, function(err){
        logger.error('Fail to get user in wechat site message handlers: ' + err);
        logger.error(err.stack);
    });
};

/**
 * bind role message for tenant operation
 * @param handler
 */
RoleMsgDispatcher.prototype.to = function(handler){ this.emitter.on('to', handler); };

/**
 * bind role message for tenant admin
 * @param handler
 */
RoleMsgDispatcher.prototype.ta = function(handler){ this.emitter.on('ta', handler); };

/**
 * bind role message for platform operation
 * @param handler
 */
RoleMsgDispatcher.prototype.po = function(handler){ this.emitter.on('po', handler); };

/**
 * bind role message for platform admin
 * @param handler
 */
RoleMsgDispatcher.prototype.pa = function(handler){ this.emitter.on('pa', handler); };

/**
 * custom message: guest
 * register a message handler for administrator messages
 * @param handler
 */
RoleMsgDispatcher.prototype.guest = function(handler){ this.emitter.on('guest', handler); };

module.exports = RoleMsgDispatcher;