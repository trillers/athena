var subClient = require('../../../app/redis-client')('sub');
var pubClient = require('../../../app/redis-client')('pub');
var service = require('../services/botService');
var pubSubService = {
    pubClient: pubClient,
    subClient: subClient
};
var channels = {
    send: 'send',
    readProfile: 'readProfile',
    onReceive: 'onReceive',
    onAddContact: 'onAddContact'
};
pubSubService.register = function(type){
    this[type+'CbMap'] = {}
};
/**
 * subscribe all channels
 */
Object.keys(channels).forEach(function(channel){
    pubSubService.register(channel);
    pubSubService.subClient.subscribe(channel);
});
/**
 * when a msg is arriving
 */
pubSubService.subClient.on('message', function(channel, msg){
    if(channel === channels.send){
        this[channel + 'CbMap'][msg.data.MsgId].call(null, msg.err, msg.data);
        delete this[channel + 'CbMap'][msg.data.MsgId];
    }
    if(channel === channels.readProfile){
        this[channel + 'CbMap'][msg.data.bid].call(null, msg.err, msg.data);
        delete this[channel + 'CbMap'][msg.data.bid];
    }
    if(channel === channels.onAddContact){
        for(var prop in this[channel + 'CbMap']){
            this[channel + 'CbMap'][prop].call(null, msg.err, msg.data);
        }
    }
    if(channel === channels.onReceive){
        for(var prop in this[channel + 'CbMap']){
            this[channel + 'CbMap'][prop].call(null, msg.err, msg.data);
        }
    }
});
/**
 * external interface
 */
pubSubService.send = function(msg, callback){
    this[channels.send + 'CbMap'][msg.MsgId] = callback;
    pubSubService.pubClient.publish(channels.send, JSON.stringify(msg));
};
pubSubService.readProfile = function(bid, callback){
    this[channels.readProfile + 'CbMap'][bid] = callback;
    pubSubService.pubClient.publish(channels.readProfile, bid);
};
pubSubService.onAddContact = function(callback){
    this[channels.onAddContact][nextId] = callback;
    pubSubService.pubClient.publish(channels.onAddContact, {});
};
pubSubService.onReceive = function(callback){
    this[channels.onReceive][nextId] = callback;
    pubSubService.pubClient.publish(channels.onReceive, {});
};
var id = 0;
function nextId(){
    return id++
}
module.exports = pubSubService;