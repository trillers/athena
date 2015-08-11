var Actions = function(workflow, data){
    this._workflow = workflow;
    this._data = data;
    var me = this;

    var actions = workflow.actionList;
    var actionLen = actions.length;
    for(var i=0; i<actionLen; i++){
        var action = actions[i];
        this[action] = (function(action){
            return function(param){
                var current = me._data.current;
                var stateObject = me._workflow.stateMap[current];
                if(!stateObject) {
                    throw new Error(current + ' is illegal state');
                }

                if(!stateObject.actions[action]){
                    throw new Error('action ' + action + ' is not supported on state ' + current);
                }

                var transition = stateObject.outbounds[action];
                if(current!=transition.from){
                    throw new Error(current + ' does not follow transition: ' + JSON.stringify(transition));
                }
                //TODO: trigger before leave state and before action
                me._data.previous = me._data.current;
                me._data.changed = me._data.current != transition.to;
                me._data.current = transition.to;
                //TODO: trigger after leave state and after action
                return me._data.changed;
            };
        })(action);

    }
};

var WorkflowInstance = function(workflow, current, params){
    this.workflow = workflow;
    this._data = {};
    this._data.current = current || workflow.initial;
    this._data.previous = null;
    this._data.changed = false;
    this._data.params = params;
    this._actions = new Actions(workflow, this._data);
};

/**
 * Get current status
 */
WorkflowInstance.prototype.current = function(){
    return this._data.current;
};

/**
 * check if state is the same as current state
 * @param state
 * @returns {*}
 */
WorkflowInstance.prototype.is = function(state){
    return this._data.current==state;
};

/**
 * check if action can be triggered in current state
 * @param action action name
 * @returns {boolean}
 */
WorkflowInstance.prototype.can = function(action){
    var state = this.workflow.stateMap[this._data.current];
    if(!state){
        throw new Error('workflow is in an illegal state');
    }
    return state.actions[action];
};

/**
 * check if state is changed since last action,
 * if it is state which is just initiated, return false
 */
WorkflowInstance.prototype.changed = function(){
    return this._data.changed;
};

/**
 * Get available actions under the current state
 * @returns {*|Array}
 */
WorkflowInstance.prototype.availableActions = function(){
    var state = this.workflow.stateMap[this._data.current];
    if(!state){
        throw new Error('workflow is in an illegal state');
    }
    return state.actionList;
};

/**
 * Get the Actions object for action invocation.
 * @returns {Actions|*}
 */
WorkflowInstance.prototype.actions = function(){
    return this._actions;
};

var Workflow = function(name){
    this.name = name;
    this.actionMap = {};
    this.actionList = [];
    this.stateMap = {};
    this.stateList = [];
};
Workflow.INITIAL = '__initial__';
Workflow.ENDED = '__ended__';

Workflow.prototype.define = function(data){
    this.data = data;
    this.initial = data.initial;
    var transitions = this.transitionList = data.transitions;
    var transitionLen = transitions.length;
    for(var i=0; i<transitionLen; i++){
        var t = transitions[i];

        //define action
        if(!this.actionMap[t.action]){
            this.actionMap[t.action] = {transitionList: [], froms: {}, tos: {}};
        }
        var action = this.actionMap[t.action];
        action.transitionList.push(t);
        action.froms[t.from] = t.from;
        action.tos[t.to] = t.to;

        //define state from transition.from
        if(!this.stateMap[t.from]){
            this.stateMap[t.from] = {actions: {}, actionList: [], outbounds: {}, outboundList: [], inboundList: []};
        }
        var fromState = this.stateMap[t.from];
        fromState.actions[t.action] = t.action;
        fromState.actionList.push(t.action);
        fromState.outbounds[t.action] = t;
        fromState.outboundList.push(t);

        //define state from transition.to
        if(!this.stateMap[t.to]){
            this.stateMap[t.to] = {actions: {}, actionList: [], outbounds: {}, outboundList: [], inboundList: []};
        }
        var toState = this.stateMap[t.to];
        toState.inboundList.push(t);
    }

    //collect action list
    for(var a in this.actionMap){
        this.actionList.push(a);
    }

    //collect state list
    for(var s in this.stateMap){
        this.stateList.push(s);
    }
    return this;
};

/**
 * Get the state map which map state name to action map
 * key is state name
 * value is a object which has action name as key, and also action name as value
 * @returns {{}}
 */
Workflow.prototype.stateActions = function() {
    var stateActions = {};
    for(var s in this.stateMap){
        stateActions[s] = this.stateMap[s].actions;
    }
    return stateActions;
};

Workflow.prototype.newInstance = function(current, params) {
    return new WorkflowInstance(this, current, params);
};

Workflow.prototype.actions = function() {
    if(!this._actions){
        this._actions = {};
        var len = this.actionList.length;
        for(var i =0; i<len; i++){
            var action = this.actionList[i];
            this._actions[action] = action;
        }
    }
    return this._actions;
};

var Registry = function(){
    this.workflows = {};
};

Registry.prototype.workflow = function(name){
    return this.workflows[name] || (this.workflows[name] = new Workflow(name));
};

Registry.prototype.dict = function(){
    var workflowStateActions = {};
    for(var wf in this.workflows){
        workflowStateActions[wf] = this.workflows[wf].stateActions();
    }
    return workflowStateActions;
};

module.exports = {
    Registry: Registry,
    Workflow: Workflow
};