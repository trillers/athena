var cskv = require('../../customer_server/kvs/CustomerServer');
var EventEmitter = require('event').EventEmitter;
var util = require('util');
var ConversationService = require('../services/ConversationService');
function ConversationQueue(){
    EventEmitter.call(this);
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
        me.nextItem(function(err, doc){
            console.log('dispatch ok');
        })
    });
}
ConversationQueue.prototype.nextItem = function(callback){
    me.dequeue(function(err, conversation){
        me.dispatch(conversation, function(err, doc){
            return callback(null, doc)
        });
    })
}
ConversationQueue.prototype.dispatch = function(conversation, callback){
    cskv.loadCSSetByCSIdAsync.then(function(csId){
        //更新conversation，接单
        return ConversationService.updateAsync(conversation._id, {})
    })
    .then(function(doc){
        return callback(null, doc)
    })
    .catch(function(e){
        return callback(e, null)
    })
}
ConversationQueue.prototype.enqueue = function(conversation, callback){
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
    cskv.popConQueueAsync()
        .then(function(conversation){
            return callback(null, conversation);
        })
        .catch(function(err){
            return callback(err, null);
        })
}
module.exports = new ConversationQueue();