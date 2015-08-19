var cskv = require('../../customer_server/kvs/CustomerServer');
var EventEmitter = require('events').EventEmitter;
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
    cskv.loadConQueueAsync()
        .then(function(list){
            this.isClear = list === null && true || false;
            return;
        })
    this.on('taskFinish', function(data){
        cskv.pushWcCSSetAsync(data.csId)
            .then(function(){
                me.nextItem(function(err, doc){
                    console.log('dispatch ok');
                })
            })

    });
}
ConversationQueue.prototype.nextItem = function(callback){
    me.dequeue(function(err, conversation){
        if(e){
            return callback(e, null)
        }
        me.dispatch(conversation, function(err, doc){
            return callback(null, doc)
        });
    })
}
ConversationQueue.prototype.dispatch = function(conversation, callback){
    cskv.popWcCSSetAysnc.then(function(csId){
        conversation.csId = csId;
        return cskv.saveCSSByIdAsync(conversation.initiator, csId, conversation)
    })
    .then(function(doc){
        return callback(null, doc)
    })
    .catch(function(e){
        return callback(e, null)
    })
}
ConversationQueue.prototype.enqueue = function(conversation, callback){
    if(this.isClear){
        return this.nextItem(function(err, doc){
            callback && callback(null, doc)
        });
    }
    cskv.pushConQueueAsync(JSON.stringify(conversation))
        .then(function(){
            return callback && callback(null, null);
        })
        .catch(function(err){
            return callback && callback(err, null);
        })
}
ConversationQueue.prototype.dequeue = function(callback){
    var me = this;
    cskv.popConQueueAsync()
        .then(function(conversation){
            if(!conversation){
                me.isClear = true;
                return callback(new Error("the Missions Clear"), null);
            }
            return callback(null, conversation);
        })
        .catch(function(err){
            return callback(err, null);
        })
}
module.exports = new ConversationQueue();