var h2 = { version: 'WIP', settings: {} };

var util = require('./util');

var error = require('./error');
util.extend(h2, error);

var rest = require('./api-rest');
util.extend(h2, rest);

var ws = require('./api-ws');
util.extend(h2, ws);

var action = require('./action');
util.extend(h2, action);

/**
 * the single object which represents the state and logic of a whole application
 * @constructor
 */
var Domain = function(){
    this._actions = {};
    this._restApiFactories = {};
    this._wsApiFactories = {};
};

/**
 * Get or create an action of domain.
 * @param name action name which follows a action naming convention
 * @returns {Action}
 */
Domain.prototype.action = function(name){
    var action = this._actions[name];
    return action ? action : (this._actions[name] = new h2.Action(this, name)) ;
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
        var existed = !!this._restApiFactories[name];
        !existed && (this._restApiFactories[name] = new h2.RestApiFactory(o));
        existed && this._restApiFactories[name].options(o);
    }

    return this._restApiFactories[name];
};

Domain.prototype.wsApi = function(factory, options){
    var config = typeof factory === 'object' || typeof options === 'object';
    var useDefault = typeof factory !== 'string';
    var name = useDefault ? 'default' : factory;
    var o = useDefault ? factory : options;

    //TODO: add WebSocket api factories
    return this._wsApiFactories[name];
};

h2.domain = function(){
    return new Domain();
};

module.exports = h2;
