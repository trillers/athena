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
    var key = this.genKey(handler.type);
    this.handlers[key] = handler;
};

prototype.setDefaultHandler = function(handler){
    this.defaultHandler = handler;
};

prototype.setNullHandler = function(handler){
    this.nullHandler = handler;
};

prototype.dispatch = function(user, message, res){
    var self = this;
    var role = user.role;
    var handler = self.handlers[role];
    handler && handler.handle(user, message, res);
}

module.exports = CustomerServerDispatcher;