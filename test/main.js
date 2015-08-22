console.log('1213231311312')
var command = require('../src/modules/customer_server/handlers/commands');
var cmdWorkflow = require('../src/modules/customer_server/common/FSM').getWf('cmdWorkflow');
var message = {
    Content:':ol',
    MsgType:'text'
}
var stt = 'of';
var commandType = command.commandType(message);
if(commandType) {
    console.log(command.getActionName(commandType))
    var executeFn = command.commandHandler(commandType);
    if(cmdWorkflow.canInWild(command.getActionName(commandType))){
        executeFn(user, message, function(err, data){
            var status = cmdWorkflow.transition(command.getActionName(commandType), stt)
        });
        console.log('ok')
    }else{
        console.log('illeage')
    }
}