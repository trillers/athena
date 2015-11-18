var EventEmitter = require('events').EventEmitter;
var TenantMemberRole = require('../../common/models/TypeRegistry').item('TenantMemberRole');

var RoleEmitter = function(){
    this.emitter = new EventEmitter();
};

/**
 * event type includes: subscribe unsubscribe LOCATION SCAN CLICK VIEW
 * msg type includes: text image voice video shortvideo location link
 * other type incudes: raw (for all message), event (for all event),
 * message (for all pure message), unknown.
 * @param context
 */
RoleEmitter.prototype.emit = function(context){
    var self = this;
    var user = {}//TODO get user
    if (user.role == TenantMemberRole.PlatformOperation.value()) {
        self.emitter.emit('po', 'po', context);
    }
    else {
        //for other unknown roles, ignore it
    }//TODO add catch block
};

/**
 * custom message: po
 * register a message handler for platform operation messages
 * @param handler
 */
RoleEmitter.prototype.po = function(handler){ this.emitter.on('po', handler); };

module.exports = RoleEmitter;