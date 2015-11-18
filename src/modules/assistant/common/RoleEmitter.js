var EventEmitter = require('events').EventEmitter;
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');

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
    context.getUser().then(function(user){
        console.log('**************************************');
        console.log(user);
        if(user.role == UserRole.Customer.value()){
            self.emitter.emit('customer', 'customer', context);
        }
        else if(user.role == UserRole.CustomerService.value()){
            self.emitter.emit('cs', 'cs', context);
        }
        else if(user.role == UserRole.Admin.value()){
            self.emitter.emit('admin', 'admin', context);
        }
        else if(user.role == UserRole.Bot.value()){
            self.emitter.emit('bot', 'bot', context);
        }
        else{
            //for other unknown roles, ignore it
        }
    }); //TODO add catch block
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