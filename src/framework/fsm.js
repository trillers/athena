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
}
Workflow.prototype.compose = function(data){
    var me = this;
    me.data = data;
    me.curr = data.initial;
    var actions = data.actions;
    for(var i=0, len=actions.length; i<len; i++){
        var currAction = actions[i];
        var action = me.actionsMap[currAction.name];
        //build action
        if(!me.actionsMap[currAction.name]){
            action = me.actionsMap[currAction.name] = {actionList: [], froms: {}, tos:{}};
        }
        action.actionList.push(currAction);
        if(Array.isArray(currAction.from)){
            currAction.from.forEach(function(from){
                if(action.froms.hasOwnProperty(from)){
                    throw new Error('workflow action property [from] has already exist');
                }else{
                    action.froms[from] = from
                }
            })
        }else{
            action.froms[currAction.from] = currAction.from
        }

        if(Array.isArray(currAction.to)){
            currAction.to.forEach(function(to){
                if(action.tos.hasOwnProperty(to)){
                    throw new Error('workflow action property [to] has already exist');
                }else{
                    action.tos[to] = to
                }
            })
        }else{
            action.tos[currAction.to] = currAction.to
        }

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
    }
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
Workflow.prototype.init = function (){
    var me = this;
    this.actions.forEach(function(action){
        me[action.name] = function(){
            if(me.can(action.name)){
                this.status = action.to;
            }else{
                throw new Error('the current Status can,t execute the action');
            }
        }
    })
}
module.exports.FSM = new FSM();
module.exports.Workflow = Workflow;