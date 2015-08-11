var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Events = function(){
    //EventEmitter.call(this);
};
util.inherits(Events, EventEmitter);

module.exports = Events;