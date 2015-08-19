var cskv = require('../kvs/CustomerServer');
var redis = require('redis');
var Promise = require('bluebird');

var CustomerServerDispatcher = function(){
    this.handlers = {};
    this.defaultHandler = null;
    this.nullHandler = null;
}

var prototype  = CustomerServerDispatcher.prototype;

prototype.register = function(handler){
    var key = handler.type;
    this.handlers[key] = handler;
};

prototype.setDefaultHandler = function(handler){
    this.defaultHandler = handler;
};

prototype.setNullHandler = function(handler){
    this.nullHandler = handler;
};

prototype.dispatch = function(user, message){
    var self = this;
    var role = user.role;
    var handler = self.handlers[role];
    console.log(role);
    handler && handler.handle(user, message);
}

module.exports = CustomerServerDispatcher;