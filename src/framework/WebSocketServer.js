var settings = require('athena-settings');
var wsServer = require('socket.io').Server;
var events = require('events');


var WebSocketServer = function(options){
    //events.EventEmitter.call(this);
    this.events = new events.EventEmitter();
    this.options = options;
    this.handlers = {};
};

var P = WebSocketServer.prototype;

P.start = function () {
    this.events.on('message', this._onMessage.bind(this));
    this.wss = new wsServer(this.options);
    this.wss.on('connection', this._onConnection.bind(this));
    this.wss.on('error', this._onError.bind(this));
};

P.stop = function () {
    if (!this.wss) {
        console.warn('WebSocket Server is not started, so it cannot be stopped');
        return false;
    }
    this.wss.off('connection');
    this.wss.off('error');
    this.wss.close();
};

P.addEventHandler = function (handler) {
    this.handlers[handler.type] = handler;
};

P.removeEventHandler = function (handler) {
    var type = typeof handler == 'string' ? handler : handler.type;
    delete this.handlers[type];
};

P._onConnection = function (ws) {
    var me = this;
    ws.on('message', function (message) {
        me.events.emit('message', ws, message);
    });
};

P._onError = function (error) {
    console.error(error); //TODO
};

P._onMessage = function (ws, msg) {
    var msgJson = null;
    try {
        msgJson = JSON.stringify(msg);
        if (msgJson.type) {
            var handler = this.handlers[msgJson.type];
            if (handler) {
                if (handler.handle && typeof handler.handle == 'function') {
                    handler.handle(ws, msgJson);
                }
                else {
                    console.warn('The ws event handler whose type is ' + msgJson.type + ' has no legal handle function');
                }
            }
            else {
                console.warn('There are no handler whose type is ' + msgJson.type);
            }
        }
        else {
            console.error('The evented message has no type property: ' + msg);
        }
    }
    catch (e) {
        console.warn('skip the message, it is not evented websocket message: ' + msg);
        console.warn(e);
    }
};

module.exports = WebSocketServer;