var cskv = require('../../kvs/CustomerServer');
var _ = require('underscore')._;
var fillUseTime = stepFnGenerator('userTime');
var fillOrigin = stepFnGenerator('origin');
var fillDestination = stepFnGenerator('destination');
var command = require('../commands');
var thunkify = require('thunkify');
var fillFormThunk = thunkify(fillForm);
var caseService = require('../../../case/services/CaseService');
var wechatApi = require('../../../wechat/common/api').api;
var co = require('co')

//placeCase:openid  {type: ct, payload:{xxx: 1, yyy: 2}, step:2}
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
        fn: fillDestination
    }
};
module.exports = function(data, user, message){
    var args = arguments;
    co(function* (){
        var result = yield cancelOrder(user, message);
        if(!result){
            var data = yield fillFormThunk(data.step, args);
            if(allDone(data)){
                return yield createCaseToMango(data, user);
            };
        }
        return;
    })
};
function allDone(data){
    return data.step === Object.keys(step).length - 1;
}
function* createCaseToMango(data, user){
    try{
        var doc = yield caseService.create(data);
        yield wechatApi.sendTextAsync(user.wx_openid, '下单成功');
    }catch(err){
        yield wechatApi.sendTextAsync(user.wx_openid, '下单失败，请联系管理员');
    }
}
function* cancelOrder(user, message){
    if(command.commandType(message) && command.commandType(message) === command.commandSet.rollback){
        yield cskv.delPlaceCaseAsync(user.wx_openid);
        yield wechatApi.sendTextAsync(user.wx_openid, '订单已取消');
        return true;
    }
    return false;
}
function fillForm(type, args, callback){
    return step[type]([].concat.call(args, callback));
}
function stepFnGenerator(type){
    return function(){
        var callback = [].slice.call(arguments, -1);
        data[type] = arguments.message.Content;
        data['step'] += 1;
        cskv.savePlaceCaseAsync(user.wx_openid, data)
        .then(function(data){
            if(step && step[arguments.data.step -1].res){
                wechatApi.sendTextAsync(user.wx_openid, step[arguments.data.step -1].res, function(){
                    console.log('step tips');
                    callback(null, data);
                })
            };
        })
        .catch(function(err){
            throw new Error('case handling error occur.');
        })
    }
}