var cskv = require('../../kvs/CustomerServer');
var _ = require('underscore')._;
var fillUseTime = stepFnGenerator('userTime');
var fillOrigin = stepFnGenerator('origin');
var fillDestination = stepFnGenerator('destination');
var command = require('../commands');
var thunkify = require('thunkify');
var Promise = require('bluebird')
var fillFormThunk = thunkify(fillForm);
var caseService = require('../../../case/services/CaseService');
var wechatApi = require('../../../wechat/common/api').api;
var co = require('co')

//placeCase:openid  {type: ct, payload:{xxx: 1, yyy: 2}, step:2}
var step = {
    1: {
        fn: fillUseTime,
        res: '[系统]:请输入出发地'
    },
    2: {
        fn: fillOrigin,
        res: '[系统]:请输入目的地'
    },
    3: {
        fn: fillDestination
    }
};
module.exports = function(data, user, message){
    var codata = data;
    var args = arguments;
    co(function* (){
        var result = yield cancelOrder(user, message);
        if(!result) {
            try {
                var executedData = yield fillFormAsync(codata.step, args)
                if (allDone(executedData)) {
                    return yield createCaseToMango(executedData, user);
                }
                ;
            } catch (e) {
                console.log('Error Occur------------------')
                console.log(e)
            }
        }
        return;
    })
};
function allDone(data){
    return data.step === Object.keys(step).length + 1;
}
function* createCaseToMango(data, user){
    try{
        var doc = yield caseService.create(data);
        yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:下单成功');
        yield cskv.saveCSStatusByCSOpenIdAsync(user.wx_openid, 'busy');
        yield cskv.delPlaceCaseAsync(user.wx_openid);
    }catch(err){
        yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:下单失败，请联系管理员');
        yield cskv.delPlaceCaseAsync(user.wx_openid);
    }
}
function* cancelOrder(user, message){
    if(command.commandType(message) === command.commandSet.rollback){
        yield cskv.delPlaceCaseAsync(user.wx_openid);
        yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:订单已取消');
        yield cskv.saveCSStatusByCSOpenIdAsync(user.wx_openid, 'busy');
        return true;
    }
    return false;
}
function fillForm(type, args, callback){
    if(step && step[type] && step[type]['fn']){
        return step[type]['fn']([].concat.call([].slice.call(args), callback));
    }else{
        return callback(null, args[0][0])
    }
}
var fillFormAsync = Promise.promisify(fillForm)
function stepFnGenerator(type){
    return function(){
        var data = arguments[0][0];
        var user = arguments[0][1];
        var message = arguments[0][2];
        var callback = arguments[0][3];
        data[type] = message.Content;
        data['step'] += 1;
        cskv.savePlaceCaseAsync(user.wx_openid, data)
        .then(function(){
            if(step && step[data.step -1].res){
                return wechatApi.sendTextAsync(user.wx_openid, step[data.step -1].res)
            };
            return data;
        })
        .then(function(data){
            callback(null, data);
        })
        .catch(function(err){
            console.log(err);
            callback(err, null);
        })
    }
}