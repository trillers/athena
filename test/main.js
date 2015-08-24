console.log('1213231311312')
var command = require('../src/modules/customer_server/handlers/commands');
var FSM = require('../src/framework/fsm').FSM;
var cmdWorkflow = FSM.create({
    name: 'cmdWorkflow',
    initial: null,
    actions:[
        {name: 'bindUser', from: 'busy', to: 'busy'},
        {name: 'rollback', from: 'case', to: 'busy'},
        {name: 'quit', from: 'busy', to: 'free'},
        {name: 'online', from: 'off', to: 'free'},
        {name: 'offline', from: ['free', 'busy'], to: 'off'},
        {name: 'callTaxi', from: 'busy', to: 'case'},
        {name: 'submitOrder', from: 'case', to: 'busy'}
    ],
    attach:{
        onleavebusy: function(){

        }
    }
})
var message = {
    Content:':ol',
    MsgType:'text'
}
var stt = 'off';
var commandType = command.commandType(message);
if(commandType) {
    console.log(command.getActionName(commandType))
    var executeFn = command.commandHandler(commandType);
    if(cmdWorkflow.canInWild(command.getActionName(commandType), stt)){

            var status = cmdWorkflow.transition(command.getActionName(commandType), stt)
        console.log(status)
        console.log('ok')
    }else{
        console.log('illeage')
    }
}