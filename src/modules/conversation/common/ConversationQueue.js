var cskv = require('../../customer_server/kvs/CustomerServer');
var EventEmitter = require('event').EventEmitter;
var util = require('util');
function ConversationQueue(concurrency){
    EventEmitter.call(this);
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
    this.init();
}
util.inherits(ConversationQueue, EventEmitter);
ConversationQueue.prototype.getRunningConversation = function(openid){
    cskv.loadCSSByIdAsync(openid)
        .then(function(conversation){
            return callback(null, conversation);
        })
        .catch(function(err){
            return callback(err, null);
        })
}
ConversationQueue.prototype.getAllConversation = function(callback){
    return callback(this.queue);
}
ConversationQueue.prototype.setDispatcher = function(dispatcher){
    this.dispatcher = dispatcher;
}
ConversationQueue.prototype.init = function(){
    var me = this;
    this.on('taskFinish', function(){
        me.dequeue(function(){
            me.emit('taskFinish');
            me.dispatch();
        })
    });
}
ConversationQueue.prototype.dispatch = function(conversation, callback){

}
ConversationQueue.prototype.enqueue = function(conversation, callback){
    if(this.running < this.concurrency){

    }
    cskv.pushConQueueAsync(JSON.stringify(conversation))
        .then(function(){
            return callback(null, null);
        })
        .catch(function(err){
            return callback(err, null);
        })
}
ConversationQueue.prototype.dequeue = function(callback){
    var me = this;
    if(this.running >= this.concurrency){
        return;
    }
    this.running++;
    cskv.popConQueueAsync()
        .then(function(conversation){
            return this.dispatcher.handle(conversation, callback);
        })
        .catch(function(err){
            return callback(err, null);
        })
}
module.exports = new ConversationQueue(5);