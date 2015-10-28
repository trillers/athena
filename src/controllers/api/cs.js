var csKvs = require('../../modules/cs/kvs/CustomerService');
var userService = require('../../modules/user/services/UserService');
var wechatUserService = require('../../modules/user/services/WechatUserService');
var UserRole = require('../../modules/common/models/TypeRegistry').item('UserRole');
var csState = require('../../modules/common/models/TypeRegistry').item('CSState');
var Promise = require('bluebird');

module.exports = function(router) {
    router.get('/find', function*(){
        try{
            var csList = yield userService.getRoleListAsync(UserRole.CustomerService.value());
            this.body = csList;
        }catch(err){
            console.log('cs router find err:' + err);
            this.body = null;
        }
    });
    router.get('/del', function*(){
        try {
            var csOpenId = this.query.openId;
            yield wechatUserService.deleteByOpenidAsync(csOpenId);
            this.body = null;
        }catch(err){
            console.log('cs router del err:' + err);
            this.body = null;
        }
    });
    router.get('/snapshot', function*(){
        var res = {};
        try{
            var csList = yield userService.getRoleListAsync(UserRole.CustomerService.value());
            var csSum = csList.length;
            var onlineCsSum = yield getOnlineCsSum(csList);
            var waitCsSum = yield getWaitCsSum();
            var inServiceCsSum = onlineCsSum - waitCsSum;
            res.csSum = csSum;
            res.onlineCsSum = onlineCsSum;
            res.inServiceCsSum = inServiceCsSum;
            this.body = res;
        }catch(err){
            console.log('cs controller router snapshot err: ' + err);
            this.body = null;
        }
    });
}

var getOnlineCsSum = function*(csList){
    var sum = 0;
    var actionArr = [];
    csList.forEach(function (item) {
        actionArr.push(csKvs.loadCSStatusByCSOpenIdAsync(item.wx_openid));
    });
    yield Promise.all(actionArr)
        .then(function(arr){
            arr.forEach(function(item, index){
                if(item == csState.online.value()){
                    sum++;
                }
            });
        });
    return sum;
}

var getWaitCsSum = function*(){
    var waitCsArr = yield csKvs.loadWcCSSetAsync();
    return waitCsArr.length;
}