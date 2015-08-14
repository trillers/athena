var cskv = require('../kvs/CustomerServer');
var redis = require('redis');
var Promise = require('bluebird');

var CustomerServerDispatcher = function(){

}

var prototype  = CustomerServerDispatcher.prototype;

prototype.dispatch = function(user, message){
    var self = this;

}

module.exports = CustomerServerDispatcher;