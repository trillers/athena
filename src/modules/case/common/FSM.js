var fsmModule = require('../../../framework/fsm');
var _ = require('underscore')
var Workflow = fsmModule.Workflow;
var FSM = fsmModule.FSM;
var stt = {
    'cancelled': 'cancelled',
    'draft': 'draft',
    'reviewing': 'reviewing',
    'applying': 'applying',
    'undertake': 'undertake',
    'inservice': 'inservice',
    'completed': 'completed',
    'unpay': 'unpay',
    'payed': 'payed'
}
var carCaseWorkflow = FSM.create({
    name: 'carCaseWorkflow',
    initial: null,
    actions:[
        {name: 'cancel', from: ['draft', 'reviewing', 'applying'], to: 'cancelled'},
        {name: 'reject', from: 'reviewing', to: 'draft'},
        {name: 'apply', from: 'reviewing', to: 'applying'},
        {name: 'take', from: 'applying', to: 'undertake'},
        {name: 'service', from: 'undertake', to: 'inservice'},
        {name: 'complete', from: 'inservice', to: 'completed'},
        {name: 'unpay', from: 'completed', to: 'unpay'},
        {name: 'pay', from: 'unpay', to: 'payed'}
    ]
});
FSM.registry(carCaseWorkflow);
module.exports = FSM;
