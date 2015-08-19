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
                return cskv.delCSSByIdAsync(data.csId)
            })
            .then(function(){
                data['stt'] = 'fn';
                return ConversationService.update(data._id, data);
            })
            .then(function(){
                me.nextItem(function(err, doc){
                    console.log('dispatch ok');
                })
            })

    });
}
ConversationQueue.prototype.nextItem = function(callback){
    var me = this;
    me.dequeue(function(err, conversation){
        if(err){
            return callback(err, null)
        }
        me.dispatch(conversation, function(err, doc){
            return callback(null, doc)
        });
    })
}
ConversationQueue.prototype.dispatch = function(conversation, callback){
    console.log('dispath begin=============================================')
    cskv.popWcCSSetAsync().then(function(csId){
        if(!csId){
            Promise.reject(new Error('workers all busy'));
        }
        conversation.stt = 'hd';
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
    console.log('conversation enqueue');
    if(this.isClear){
        return this.nextItem(function(err, doc){
            callback && callback(null, doc)
        });
    }
    this.dispatch(conversation, function(err, doc){
        if(err){
            cskv.pushConQueueAsync(conversation)
                .then(function(){
                    return callback && callback(null, null);
                })
                .catch(function(err){
                    return callback && callback(err, null);
                })
        }
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