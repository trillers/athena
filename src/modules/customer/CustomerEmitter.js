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

//TODO: bind event handlers here

module.exports = emitter;