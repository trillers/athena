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
emitter.botMsg = function(handler){ this.on('botMsg', handler) };
emitter.botCvs = function(handler){ this.on('botCvs', handler) };

require('./handlers/customerCvsSiteHandler')(emitter);
require('./handlers/customerMsgSiteHandler')(emitter);
require('./handlers/customerCvsBotHandler')(emitter);
require('./handlers/customerMsgBotHandler')(emitter);

module.exports = emitter;