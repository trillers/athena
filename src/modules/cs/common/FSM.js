var fsmModule = require('../../../framework/fsm');
var _ = require('underscore')
var Workflow = fsmModule.Workflow;
var FSM = fsmModule.FSM;
var stt = {
    'free': 'free',
    'offline': 'off',
    'busy': 'busy',
    'case': 'case'
}
var cmdWorkflow = FSM.create({
    name: 'cmdWorkflow',
    initial: null,
    actions:[
        {name: 'viewState', from: _.values(stt), to: _.values(stt)},
        {name: 'bindUser', from: 'busy', to: 'busy'},
        {name: 'rollback', from: 'case', to: 'case'},
        {name: 'quit', from: 'case', to: 'busy'},
        {name: 'online', from: 'off', to: 'free'},
        {name: 'offline', from: ['free', 'busy'], to: 'off'},
        {name: 'callCar', from: 'busy', to: 'case'},
        {name: 'submitOrder', from: 'busy', to: 'busy'},
        {name: 'modifyFrom', from: 'case', to: 'busy'},
        {name: 'modifyTo', from: 'case', to: 'busy'},
        {name: 'close', from: 'busy', to: 'free'},
        {name: 'cancelOrder', from: 'busy', to: 'busy'}
    ]
});
FSM.registry(cmdWorkflow);
module.exports = FSM;
