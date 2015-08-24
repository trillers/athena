var domain = require('domain');
var EventEmitter = require('events').EventEmitter;
var util = require('util')

function Action(name){
    this.name = name;
    this.actionInvocation = null
    EventEmitter.call(this);
}
util.inherits(Action, EventEmitter);
function ActionInvocation(data){
    EventEmitter.call(this);
    this._data = data;
    this._action = data._action;
}
util.inherits(ActionInvocation, EventEmitter);
ActionInvocation.prototype.execute = function(data){
    var invocation = this;
    this._data = data;
    this.emit('any', invocation._data);
}
ActionInvocation.prototype.onExecute = function(fn){
    var invocation = this;
    this.on('any', function(){
        fn.call(invocation, this._data);
    })
}
Action.prototype.execute = function(data){
    this.emit('any', data)
}
Action.prototype.onExecute = function(fn){
    this.on('any', fn)
}
Action.prototype.newInstance = function(data){
    data._actions = this;
    return new ActionInvocation(data);
}
var domain = {
    actionsMap: {}
};
domain.action = function(actionName){
    var action = this.actionsMap[actionName]
    if(action){
        return action;
    }else{
        return this.actionsMap[actionName] = new Action(actionName)
    }
}
var TestAction = domain.action('TestAction');

var testInvocatin = TestAction.newInstance({'1231': '123'});
testInvocatin.onExecute(function(data){
    console.log(data)
})
testInvocatin.execute({fdfsfs:"3213213123"})
TestAction.onExecute(function(data){
    console.log(data)
})
TestAction.onExecute(function(data){
    console.log(data)
})
TestAction.execute({
    foo: "bar1"
})