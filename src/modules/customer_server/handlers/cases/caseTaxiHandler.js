var cskv = require('../../kvs/CustomerServer');
var _ = require('underscore')._;
//placeCase:openid  {type: ct, payload:{xxx: 1, yyy: 2}, step:2}
var fillUseTime = stepFnGenerator('userTime');
var fillOrigin = stepFnGenerator('origin');
var fillDestination = stepFnGenerator('destination');
var command = require('');
var step = {
    1: {
        fn: fillUseTime,
        res: '请输入出发地'
    },
    2: {
        fn: fillOrigin,
        res: '请输入目的地'
    },
    3: {
        fn: fillDestination,
        res: '生成订单'
    }
};
module.exports = function(data, user, message, res){
    var args = arguments;
    co(function* (){
        yield cancelOrder(user, message);
        return fillForm(data.step, args)
    })
};
function* cancelOrder(user, message){
    if(command.isCommand(message) && command.isCommand(message) === command.getSet().quit){
        yield cskv.delPlaceCaseAsync(user.wx_openid);
        res.reply('订单已取消');
    }
}
function fillForm(type, args){
    return step[type](args);
}
function stepFnGenerator(type){
    return function(){
        data[type] = arguments.message.content;
        data['step'] += 1;
        cskv.updatePlaceCaseAsync(data)
        .then(function(data){
            res.reply(step[arguments.data.step -1].res);
        })
        .catch(function(err){
            throw new Error('case handling error occur.');
        })
    }
}