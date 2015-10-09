var fsmModule = require('../../../framework/fsm');
var _ = require('underscore')
var Workflow = fsmModule.Workflow;
var FSM = fsmModule.FSM;
var stt = {
    'online': 'online',
    'offline': 'offline',
};
var cmdWorkflow = FSM.create({
    name: 'cmdWorkflow',
    initial: null,
    actions:[
        {name: 'viewState', from: _.values(stt), to: _.values(stt)},
        {name: 'online', from: 'offline', to: 'online'},
        {name: 'offline', from: ['online'], to: 'offline'}
    ]
});
//var cmdWorkflow = FSM.create({
//    name: 'cmdWorkflow',
//    initial: null,
//    actions:[
//        {name: 'viewState', from: _.values(stt), to: _.values(stt)},
//        {name: 'bindUser', from: 'busy', to: 'busy'},
//        {name: 'rollback', from: 'case', to: 'case'},
//        {name: 'quit', from: 'case', to: 'busy'},
//        {name: 'online', from: 'off', to: 'free'},
//        {name: 'offline', from: ['free', 'busy'], to: 'off'},
//        {name: 'callCar', from: 'busy', to: 'case'},
//        {name: 'submitOrder', from: 'busy', to: 'busy'},
//        {name: 'modifyFrom', from: 'case', to: 'busy'},
//        {name: 'modifyTo', from: 'case', to: 'busy'},
//        {name: 'close', from: 'busy', to: 'free'},
//    ]
//});
FSM.registry(cmdWorkflow);
module.exports = FSM;
