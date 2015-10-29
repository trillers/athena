var h2 = {};

var util = require('./util');

var observableFn = require('seedriot').observable;

/**
 * TODO:
 * Append result array (arguments) to ['done'] array
 * for example:
 *   var doneArgs = ['done'];
 *   var comingArgus = [{_id: 'h3j5', name: 'activity name'}, true];
 *   Array.prototype.push.apply(doneArgs, comingArgs);
 *   console.log(doneArgs);
 *   //['done', {_id: 'h3j5', name: 'activity name'}, true]
 */
var triggerEvent = function(observable, event, args){
    var triggerArgs = [event];
    Array.prototype.push.apply(triggerArgs, args);
    observable.trigger.apply(observable, triggerArgs);
};

var bindNameEventWithContext = function(context, observable, listeners, name){
    var eventListeners = listeners[name];
    var len = eventListeners.length;
    var listener = null;
    for(var i=0; i<len; i++){
        listener = eventListeners[i];
        observable.on(name, listener.bind(context));
    }
};

/**
 * TODO
 */
var ActionInvocation = function(action, inputs){
    this.id = util.nextId(action.name());
    this.action = action;
    this.inputs = inputs;
    this.outputs = null;
    this.error = null;
    this.executed = false;

    var events = this._events = observableFn({});
    var listeners = this.action._listeners;

    bindNameEventWithContext(this, events, listeners, 'execute');
    bindNameEventWithContext(this, events, listeners, 'unexecute');
    bindNameEventWithContext(this, events, listeners, 'done');
    bindNameEventWithContext(this, events, listeners, 'fail');
    bindNameEventWithContext(this, events, listeners, 'always');
};

/**
 * TODO
 */
ActionInvocation.prototype.execute = function(){
    triggerEvent(this._events, 'execute', this.inputs);
};

/**
 * TODO
 */
ActionInvocation.prototype.unexecute = function(){
    triggerEvent(this._events, 'unexecute', this.inputs);
};

ActionInvocation.prototype.onDone = function(listener){
    this._events.on('done', listener.bind(this));
    return this;
};

ActionInvocation.prototype.onFail = function(listener){
    this._events.on('fail', listener.bind(this));
    return this;
};

ActionInvocation.prototype.onAlways = function(listener){
    this._events.on('always', listener.bind(this));
    return this;
};

/**
 * Trigger 'done' event following 'always' event.
 * This method is supposed to be called in action
 * execute listener to trigger domain state-changed
 * notification event (done).
 */
ActionInvocation.prototype.done = function(){
    var results = util.getArguments(arguments);
    this.outputs = results;
    this.executed = true;
    triggerEvent(this._events, 'done', results);
    triggerEvent(this._events, 'always', results);
};

/**
 * Trigger 'fail' event following 'always' event.
 * This method is supposed to be called in action
 * execute listener to trigger domain state-changed
 * notification event (fail).
 */
ActionInvocation.prototype.fail = function(){
    var errorResults = util.getArguments(arguments);
    this.error = errorResults[0];
    this.executed = true;
    triggerEvent(this._events, 'fail', errorResults);
    triggerEvent(this._events, 'always', errorResults);
};

var Action = function(domain, name){
    this._domain = domain;
    this._name = name;
    this._events = observableFn({});
    this._listeners = {
        execute: [],
        unexecute: [],
        done: [],
        fail: [],
        always: []
    };
};

Action.prototype.name = function(name){
    if(name){
        this._name = name;
        return this;
    }
    else{
        return this._name;
    }
};

Action.prototype.onExecute = function(listener){
    this._listeners.execute.push(listener);
    return this;
};

Action.prototype.onUnexecute = function(listener){
    this._listeners.unexecute.push(listener);
    return this;
};

Action.prototype.onDone = function(listener){
    this._listeners.done.push(listener);
    return this;
};

Action.prototype.onFail = function(listener){
    this._listeners.fail.push(listener);
    return this;
};

Action.prototype.onAlways = function(listener){
    this._listeners.always.push(listener);
    return this;
};

Action.prototype.offDone = function(listener){
    util.remove(this._listeners.done, listener);
    return this;
};

Action.prototype.offFail = function(listener){
    util.remove(this._listeners.fail, listener);
    return this;
};

Action.prototype.offAlways = function(listener){
    util.remove(this._listeners.always, listener);
    return this;
};

/**
 * Create and execute an ActionInvocation with given input arguments.
 * @returns {ActionInvocation} the created and executed ActionInvocation object
 */
Action.prototype.execute = function(){
    var invocation = new ActionInvocation(this, util.getArguments(arguments));
    invocation.execute();
    return invocation;
};

/**
 * Create an ActionInvocation with given input arguments, then it can be execute.
 * @returns {ActionInvocation} the created and executed ActionInvocation object
 */
Action.prototype.newInvocation = function(){
    return new ActionInvocation(this, util.getArguments(arguments));
};

h2.Action = Action;

h2.ActionInvocation = ActionInvocation;

module.exports = h2;
