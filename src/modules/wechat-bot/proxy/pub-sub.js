var subClient = require('../../../app/redis-client')('sub');
var pubClient = require('../../../app/redis-client')('pub');
var pubSubService = {
    pubClient: pubClient,
    subClient: subClient
};
var channels = {
    send: 'send',
    readProfile: 'readProfile',
    onReceive: 'onReceive',
    onAddContact: 'onAddContact',
    onDisconnect: 'onDisconnect',
    onNeedLogin: 'onNeedLogin'
};
pubSubService.register = function(type){
    this[type+'CbMap'] = {}
};
/**
 * subscribe all channels
 */
Object.keys(channels).forEach(function(channel){
    pubSubService.register(channel);
    pubSubService.subClient.subscribe('sbot:' + channel);
});
/**
 * when a msg is arriving
 */
pubSubService.subClient.on('message', function(channel, msg){
    var msg = JSON.parse(msg);
    channel = channel.split(':')[1];
    if(channel === channels.send){
        pubSubService[channel + 'CbMap'][msg.data.MsgId].call(null, msg.err, msg.data);
        delete pubSubService[channel + 'CbMap'][msg.data.MsgId];
    }
    if(channel === channels.readProfile){
        pubSubService[channel + 'CbMap'][msg.data.bid].call(null, msg.err, msg.data);
        delete pubSubService[channel + 'CbMap'][msg.data.bid];
    }
    if(channel === channels.onAddContact){
        for(var prop in pubSubService[channel + 'CbMap']){
            pubSubService[channel + 'CbMap'][prop].call(null, msg.err, msg.data);
        }
    }
    if(channel === channels.onReceive){
        for(var prop in pubSubService[channel + 'CbMap']){
            pubSubService[channel + 'CbMap'][prop].call(null, msg.err, msg.data);
        }
    }
    if(channel === channels.onDisconnect){
        for(var prop in pubSubService[channel + 'CbMap']){
            pubSubService[channel + 'CbMap'][prop].call(null, msg.err, msg.data);
        }
    }
    if(channel === channels.onNeedLogin){
        for(var prop in pubSubService[channel + 'CbMap']){
            pubSubService[channel + 'CbMap'][prop].call(null, msg.err, msg.data);
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
    pubSubService.pubClient.publish(channels.readProfile, JSON.stringify({bid: bid}));
};
pubSubService.onAddContact = function(callback){
    this[channels.onAddContact + 'CbMap'][nextId()] = callback;
};
pubSubService.onReceive = function(callback){
    this[channels.onReceive + 'CbMap'][nextId()] = callback;
};
pubSubService.onDisconnect = function(callback){
    this[channels.onDisconnect + 'CbMap'][nextId()] = callback;
};
pubSubService.onNeedLogin = function(callback){
    this[channels.onNeedLogin + 'CbMap'][nextId()] = callback;
};
var id = 0;
function nextId(){
    return id++
}
module.exports = pubSubService;