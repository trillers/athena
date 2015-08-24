var command = require('../src/modules/customer_server/handlers/commands');
var FSM = require('../src/framework/fsm').FSM;
var cmdWorkflow = FSM.create({
    name: 'cmdWorkflow',
    initial: "off",
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
        onleavestate: function(){
            console.log("leave stat")
        },
        onenterstate: function(){
            console.log("enter stat")
        },
        onleaveoff: function(){
            console.log("leave off")
        },
        onenterfree: function(data){
            console.log("enter off")
        },
        onbeforeevent: function(){
            console.log("before event")
        },
        onbeforeonline: function(){
            console.log("before online")
        }
    }
});
cmdWorkflow.startup()
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
        console.log(cmdWorkflow.online(null, {data: "123"}))
        //var status = cmdWorkflow.transition(command.getActionName(commandType), stt)
        //console.log(status)
        console.log('ok')
    }else{
        console.log('illeage')
    }
}/**
 * Created by bjhl on 15/8/24.
 */
