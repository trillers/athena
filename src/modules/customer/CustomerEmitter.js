/**
 * events definition here
 * conversation: triggered when a new customer conversation is created and appended to queue
 * handler(conversation){
 * }
 * message: triggered when a new message is arrived
 * handler(conversation, message){
 * }
 */
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
emitter.message = function(handler){ this.on('message', handler) };
emitter.conversation = function(handler){ this.on('conversation', handler) };

module.exports = emitter;