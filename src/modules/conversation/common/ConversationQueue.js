function ConversationQueue(concurrency){
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
    this.init();
}
ConversationQueue.prototype.getRunningConversation = function(openid){
    return conversation;
}
ConversationQueue.prototype.getAllConversation = function(callback){
    return callback(this.queue);
}
ConversationQueue.prototype.setDispatcher = function(dispatcher){
    this.dispatcher = dispatcher;
}
ConversationQueue.prototype.init = function(){

}
ConversationQueue.prototype.enqueue = function(conversation, callback){
    this.queue.push(conversation);
    return callback();
}
ConversationQueue.prototype.dequeue = function(id, callback){
    var conversation = this.queue.pop(id);
    return this.dispatcher.dispatch(conversation, callback);
}
module.exports = new ConversationQueue(5);