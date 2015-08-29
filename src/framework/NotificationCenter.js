var domain = require('domain');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Action(name, channel){
    this.name = name;
    if(this.channel){
        this.channel = channel;
        this.actionInvocation = new ActionInvocation({channel: channel});
    }else{
        this.actionInvocation = new ActionInvocation();
    }
    this.listeners = [];
    EventEmitter.call(this);
    this.constructor = Action
};
util.inherits(Action, EventEmitter);

function ActionInvocation(data){
    EventEmitter.call(this);
    if(data){
        this._data = data._data;
        this._channel = data.channel;
        this._action = data._action;
    }
};
util.inherits(ActionInvocation, EventEmitter);

ActionInvocation.prototype.execute = function(){
    if(!this._channel){
        return this.emit('execute', this._data);
    }
    return this.emit(this._channel, this._data);
};
ActionInvocation.prototype.onExecute = function(fn){
    var invocation = this;
    if(!this._channel){
        return this.on('execute', function(){
            fn.call(invocation, invocation._data)
        })
    }
    this.on(this._channel, function(){
        fn.call(invocation, invocation._data)
    })
};
Action.prototype.execute = function(data){
    this.actionInvocation._data = data
    data.channel && (this.actionInvocation._channel = data.channel)
    this.actionInvocation.execute();
};
Action.prototype.onExecute = function(channel, fn){
    if(fn){
        return this.actionInvocation.on(channel, fn.bind(this))
    }
    fn = channel
    this.actionInvocation.on('execute', fn.bind(this))
};
Action.prototype.newInstance = function(data){
    var me = this;
    var constructorInfo = {
        _data: data,
        _action:me,
        _channel: data.channel
    }
    return new ActionInvocation(constructorInfo);
};
var domain = {
    actionsMap: {}
};
domain.action = function(actionName){
    var action = this.actionsMap[actionName];
    if(action){
        return action;
    }else{
        return this.actionsMap[actionName] = new Action(actionName);
    }
};
function _mixin(target, source){
    for(var prop in source){
        if(!target.hasOwnProperty(prop)){
            target[prop] = source[prop];
        }else{
            throw new Error("the prop has owned")
        }
    }
    return target
}

module.exports = domain;