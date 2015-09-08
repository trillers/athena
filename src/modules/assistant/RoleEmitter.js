var EventEmitter = require('events').EventEmitter;
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
    var user = context.user;
    if(user.role=='customer'){ //TODO revise it soon
        this.emitter.emit('customer', 'customer', context);
    }
    if(user.role=='customer service'){ //TODO revise it soon
        this.emitter.emit('cs', 'cs', context);
    }
    if(user.role=='administrator'){ //TODO revise it soon
        this.emitter.emit('admin', 'admin', context);
    }
    else{
        //for other unknown roles, ignore it
    }
};

/**
 * custom message: customer
 * register a message handler for customer messages
 * @param handler
 */
RoleEmitter.prototype.customer = function(handler){ this.emitter.on('customer', handler); };

/**
 * custom message: cs
 * register a message handler for customer service messages
 * @param handler
 */
RoleEmitter.prototype.cs = function(handler){ this.emitter.on('cs', handler); };

/**
 * custom message: admin
 * register a message handler for administrator messages
 * @param handler
 */
RoleEmitter.prototype.admin = function(handler){ this.emitter.on('admin', handler); };

module.exports = RoleEmitter;