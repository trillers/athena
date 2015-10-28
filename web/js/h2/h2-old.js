var h2 = { version: 'WIP', settings: {} };

/*
 * observable util
 */
var observableFn = require('seedriot').observable;

var getArguments = function(args){return Array.prototype.slice.call(args, 0);};

var _extend = function(obj, source) {
    for (var prop in source) {obj[prop] = source[prop];}
    return obj;
};

var _remove_item = function(array, item) {
    var i = array.indexOf(item);
    i > -1 && array.splice(i, 1);
};

var _ids = {};

var nextId = function(name){
    if(!_ids[name]) _ids[name] = 1;
    return _ids[name]++;
};

var _ajax = $ && $.ajax || require('jquery');

var _defaultRestApiOptions = {
    dataType: 'json'
};

var RestApiError = function(code, msg){
    this.code = code;
    this.msg = msg;
};

RestApiError.prototype.toString = function(){
    return 'code: ' + this.code + ', msg: ' + this.msg;
};

var RestApiErrorFactory = {};
RestApiErrorFactory.errorMap = {};

var errorsPredefined = [
    /*
     * Reserve code (100 - 199) as fundamental errors, such as
     *  network connection errors,
     *  resource is not found,
     *  request is timeout
     *  request is aborted
     */
      {code: 100, msg: 'unknown error'}         //testStatus: null
    , {code: 101, msg: 'ajax request timeout'}  //testStatus: timeout
    , {code: 102, msg: 'ajax request abort'}    //testStatus: abort

    /*
     * Reserve code (200 - 299) as server side errors, such as
     *  authentication errors,
     *  request/response parsing errors,
     *  server side runtime errors
     */
    , {code: 200, msg: 'server side error'}     //testStatus: error
    , {code: 201, msg: 'ajax parser error'}     //testStatus: parsererror
    , {code: 202, msg: 'custom error code should be <300'}

    /*
     * Reserve code (300 - xxx) as business logic errors,
     * so developers can define them by themselves.
     * No duplicated & conflict code should be guaranteed.
     */
];
var _initPredefinedErrorMap = function(map, list){
    for(var i=0; i<list.length; i++){
        var e = list[i];
        map[''+ e.code] = e;
    }
};
_initPredefinedErrorMap(RestApiErrorFactory.errorMap, errorsPredefined);

var jqAjaxPredefinedErrorMap = {
    timeout: '101',
    abort: '102',
    error: '200',
    parsererror: '201'
};
var _unknown_code = '100';
var _unknown_error = RestApiErrorFactory.errorMap[_unknown_code];
var _code_conflict_code = '202';
var _code_conflict_error = RestApiErrorFactory.errorMap[_code_conflict_code];

RestApiErrorFactory.stockError = function(textStatus, errorThrown){
    var code = null;
    if(!textStatus || !jqAjaxPredefinedErrorMap[textStatus]){
        code = _unknown_error.code;
    }
    else{
        code = jqAjaxPredefinedErrorMap[textStatus];
    }
    var e = this.errorMap[code];
    return new RestApiError(e.code, errorThrown || e.msg);
};

RestApiErrorFactory.customError = function(code, msg){
    var e = new RestApiError(code, msg);
    if(code<300){
        console.warn(e);
        console.warn(_code_conflict_error);
    }
    return e;
};

/**
 * Restful API Factory
 * @param method
 * @constructor
 */
var RestApiFactory = function(options){
    this._options = _defaultRestApiOptions;
    this.options(options || {});
};

RestApiFactory.prototype.options = function(options){
    _extend(this._options, options);
};

var defineHtmlMethodSetter = function(p, method){
    p[method] = function(url){
        var restApi = new RestApi(this._options);
        var o = restApi.o;
        o.method = method;
        o.url = (o.baseUrl || '') + url;
        return restApi;
    };
};

defineHtmlMethodSetter(RestApiFactory.prototype, 'get');
defineHtmlMethodSetter(RestApiFactory.prototype, 'post');
defineHtmlMethodSetter(RestApiFactory.prototype, 'put');
defineHtmlMethodSetter(RestApiFactory.prototype, 'delete');

var RestApi = function(options){
    this.o = _extend({}, options || {});
};

RestApi.prototype.drive = function(action){
    this.o.action = action;
    return this;
};

RestApi.prototype.done = function(listener){
    this.o.done = listener;
    return this;
};

RestApi.prototype.fail = function(listener){
    this.o.fail = listener;
    return this;
};

RestApi.prototype.success = function(listener){
    this.o.success = listener;
    return this;
};

RestApi.prototype.error = function(listener){
    this.o.error = listener;
    return this;
};

RestApi.prototype.always = function(listener){
    this.o.always = listener;
    return this;
};

RestApi.prototype.onDone = function(data, textStatus, jqXHR){
    if(data && data.errcode){
        var e = RestApiErrorFactory.customError(data.errcode, data.errmsg);
        this.o.fail(e);
    }
    else{
        if(data && typeof data.result !== 'undefined'){
            this.o.done(data.result);
        }
        else{
            this.o.done(data);
        }
    }
};

RestApi.prototype.onFail = function(jqXHR, textStatus, errorThrown){
    var e = RestApiErrorFactory.stockError(textStatus, errorThrown);
    this.o.fail(e);
};

RestApi.prototype.send = function(data){
    var jqXHR = _ajax({
        type: this.o.method,
        url: this.o.url,
        dataType: this.o.dataType,
        data: data || null
    });

    if(this.o.action){
        var action = this.o.action;
        this.done(function(data){action.done(data);})
            .fail(function(error){action.fail(error);});
    }

    if(this.o.done || this.o.fail){
        jqXHR.done(this.onDone.bind(this));
        jqXHR.fail(this.onFail.bind(this));
    }
    else{
        this.o.success && jqXHR.done(this.o.success);
        this.o.error && jqXHR.fail(this.o.error);
    }

    this.o.always && jqXHR.always(this.o.always);

    return jqXHR;
};

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
    this.id = nextId(action.name());
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

/**
 * Trigger 'done' event following 'always' event.
 * This method is supposed to be called in action
 * execute listener to trigger domain state-changed
 * notification event (done).
 */
ActionInvocation.prototype.done = function(){
    var results = getArguments(arguments);
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
    var errorResults = getArguments(arguments);
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
    _remove_item(this._listeners.done, listener);
    return this;
};

Action.prototype.offFail = function(listener){
    _remove_item(this._listeners.fail, listener);
    return this;
};

Action.prototype.offAlways = function(listener){
    _remove_item(this._listeners.always, listener);
    return this;
};

/**
 * Create and execute an ActionInvocation with given input arguments.
 * @returns {ActionInvocation} the created and executed ActionInvocation object
 */
Action.prototype.execute = function(){
    var invocation = new ActionInvocation(this, getArguments(arguments));
    invocation.execute();
    return invocation;
};

/**
 * Create an ActionInvocation with given input arguments, then it can be execute.
 * @returns {ActionInvocation} the created and executed ActionInvocation object
 */
Action.prototype.newInvocation = function(){
    return new ActionInvocation(this, getArguments(arguments));
};

/**
 * the single object which represents the state and logic of a whole application
 * @constructor
 */
var Domain = function(){
    this._actions = {};
    this._apiFactories = {};
    this.restApi(_defaultRestApiOptions); //set default factory options
};

/**
 * Get or create an action of domain.
 * @param name action name which follows a action naming convention
 * @returns {Action}
 */
Domain.prototype.action = function(name){
    var action = this._actions[name];
    return action ? action : (this._actions[name] = new Action(this, name)) ;
};

/**
 * Get all actions of domain.
 * @returns {{Action}}
 */
Domain.prototype.actions = function(){
    return this._actions;
};

Domain.prototype.restApi = function(factory, options){
    var config = typeof factory === 'object' || typeof options === 'object';
    var useDefault = typeof factory !== 'string';
    var name = useDefault ? 'default' : factory;
    var o = useDefault ? factory : options;

    if(config){
        var existed = !!this._apiFactories[name];
        !existed && (this._apiFactories[name] = new RestApiFactory(o));
        existed && this._apiFactories[name].options(o);
    }

    return this._apiFactories[name];
};

h2.domain = function(){
    return new Domain();
};


h2.RestApi = RestApi;



h2.fn = function(){};

module.exports = h2;
