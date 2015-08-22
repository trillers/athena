var fsmModule = require('../../../framework/fsm');
var Workflow = fsmModule.Workflow;
var FSM = fsmModule.FSM;
var stt = {
    'free': 'free',
    'offline': 'offline',
    'busy': 'busy',
    'case': 'case'
}
var cmdWorkflow = FSM.create({
    name: 'cmdWorkflow',
    initial: null,
    actions:[
        {name: 'viewState', from: Object.keys[stt], to: Object.keys[stt]},
        {name: 'bindUser', from: 'busy', to: 'busy'},
        {name: 'rollback', from: 'case', to: 'busy'},
        {name: 'quit', from: 'busy', to: 'free'},
        {name: 'online', from: 'offline', to: 'free'},
        {name: 'offline', from: 'free, busy', to: 'offline'},
        {name: 'callTaxi', from: '', to: 'case'}
    ]
})
FSM.registry(cmdWorkflow);
module.exports = FSM
