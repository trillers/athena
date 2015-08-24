var ListenersCombinations = {};
function FSM() {
    this.instanceMap = {};
}
FSM.prototype.registry= function(instance){
    this.instanceMap[instance.name] = instance;
}
FSM.prototype.getWf= function(name){
    return this.instanceMap[name];
}
/**
 * workflow factory
 * @param instance data
 * @returns new workflow instance
 */
FSM.prototype.create = function(data){
    var workflow = new Workflow(data);
    workflow.compose(data);
    return workflow;
}
function Workflow(data) {
    this.name = data.name;
    this.actionsMap = {};
    this.statMap = {};
    this.curr = null;
    this.previous = null;
    this.actionList = [];
    this.changed = false;
    this.listeners = {};
}
var composeActionFrom = _composeActionChannel('from')
var composeActionTo = _composeActionChannel('to')
Workflow.prototype.compose = function(data){
    this.data = data;
    this.curr = data.initial;
    var actions = data.actions;
    _composeActions(actions, this);
    _attachListeners(data, this);
    return this;
}
Workflow.prototype.is = function (s){
    this.current() === s;
}
Workflow.prototype.current = function (){
    return this.curr;
}
Workflow.prototype.can = function(e){
    if(this.actionsMap[e].froms[this.current()]){
        return true;
    }
    return false;
}
Workflow.prototype.setStt = function(s){
    if(!s || !this.statMap[s]){
        throw new Error('the stat is illegal');
    }
    this.curr = s;
}
Workflow.prototype.cannot = function(e){
    return !this.can(e);
}
Workflow.prototype.canInWild = function(e, stt){
    if(!this.actionsMap[e]){
        throw new Error('the action is illegal');
    }
    if(!stt || !(stt in this.statMap)){
        throw new Error('the stat is illegal');
    }
    if(this.actionsMap[e].froms[stt]){
        return true;
    }
    return false;
}
Workflow.prototype.transition = function(e, stt){
    if(this.canInWild(e, stt)){
        var tos = this.actionsMap[e].tos;
        if(Object.keys(tos).length > 1){
            return stt;
        }
        for(var prop in tos){
            return prop;
        }
    }else{
        throw new Error('err Occur [code] can not transform the status');
    }
}
Workflow.prototype.startup = function (){
    var me = this;
    this.actionList.forEach(function(action){
        me[action.name] = function(stt, data){
            var stt = stt || me.current();
            var listeners = me.listeners;
            if(listeners) {
                listeners.onbeforeevent && listeners.onbeforeevent.call(me, data);
                ("onbefore" + action.name in listeners) && listeners["onbefore" + action.name].call(me, data);
                listeners.onleavestate && listeners.onleavestate.call(me, data);
                ("onleave" + stt in listeners) && listeners["onleave" + stt].call(me, data);
            }
            var result = me.transition(action.name, stt);
            if(result === stt) me.changed = true;
            this.curr = result;
            if(listeners){
                listeners.onenterstate && listeners.onenterstate.call(me, data);
                ("onenter" + result in listeners) && listeners["onenter" + result].call(me, data);
                listeners.onafterevent && listeners.onafterevent.call(me, data);
                ("onafter" + action.name in listeners) && listeners["onafter" + action.name].call(me, data);
            }

        }
    })
}
function _composeActionChannel(type){
    return function(actionInMap, actionInLoop){
        if(Array.isArray(actionInLoop[type])){
            actionInLoop[type].forEach(function(channel){
                if(actionInMap[type+'s'].hasOwnProperty(channel)){
                    throw new Error('workflow action property ['+ type +'] has already exist');
                }else{
                    actionInMap[type+'s'][channel] = channel
                }
            })
        }else{
            actionInMap[type+'s'][actionInLoop[type]] = actionInLoop[type]
        }
    }
}
function _composeActions(actions, me){
    for(var i=0, len=actions.length; i<len; i++){
        var currAction = actions[i];
        var action = me.actionsMap[currAction.name];
        //build action
        if(!me.actionsMap[currAction.name]){
            action = me.actionsMap[currAction.name] = {actionList: [], froms: {}, tos:{}};
        }
        action.actionList.push(currAction);
        composeActionFrom(action, currAction);
        composeActionTo(action, currAction);
        //build state
        var fromStat = me.statMap[currAction.from];
        if(!fromStat){
            fromStat = me.statMap[currAction.from] = {actions: {}}
        }
        fromStat.actions[currAction.name] = currAction;

        var toStat = me.statMap[currAction.to];
        if(!toStat){
            toStat = me.statMap[currAction.to] = {actions: {}}
        }
        toStat.actions[currAction.name] = currAction;
        //collection actionList
        me.actionList.push(currAction)
        me.statList = Object.keys(me.statMap);
    }
}
function _composeListenersCombinations(workflow){
    for(var i=0, len=workflow.actionList.length; i<len; i++){
        ListenersCombinations['onbefore' + workflow.actionList[i].name] = 'onbefore' + workflow.actionList[i].name
        ListenersCombinations['onafter' + workflow.actionList[i].name] = 'onafter' + workflow.actionList[i].name
    }
    ListenersCombinations['onbeforeevent'] = 'onbeforeevent';
    ListenersCombinations['onafterevent'] = 'onafterevent';
    for(var i=0, len=workflow.statList.length; i<len; i++){
        ListenersCombinations['onleave' + workflow.statList[i]] = 'onleave' + workflow.statList[i]
        ListenersCombinations['onenter' + workflow.statList[i]] = 'onenter' + workflow.statList[i]
    }
    ListenersCombinations['onleavestate'] = 'onleavestate';
    ListenersCombinations['onenterstate'] = 'onafterstate';
}
function _validateListenerType(listenerName, workflow){
    _composeListenersCombinations(workflow);
    if(ListenersCombinations[listenerName]){
        return true;
    }
    return false;
}
function _attachListeners(options, workflow){
    var listeners = options.attach;
    console.log(workflow.listeners)
    for(var key in listeners){
        if(!workflow.listeners.hasOwnProperty(key)){
            if(!_validateListenerType(key, workflow)){
                throw new Error('the listener in workflow has error');
            };
            workflow.listeners[key] = listeners[key];
        }else{
            throw new Error('the listener is already exist');
        }
    }
}
module.exports.FSM = new FSM();
module.exports.Workflow = Workflow;