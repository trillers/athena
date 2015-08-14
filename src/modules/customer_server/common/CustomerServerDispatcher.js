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
    var key = this.genKey(handler.forever, handler.type);
    this.handlers[key] = handler;
};

prototype.setDefaultHandler = function(handler){
    this.defaultHandler = handler;
};

prototype.setNullHandler = function(handler){
    this.nullHandler = handler;
};

prototype.genKey = function(forever, type){
    return (forever ? 'fv' : 'tm') + type;
};

prototype.dispatch = function(user, message){
    var self = this;

}

module.exports = CustomerServerDispatcher;