var cskv = require('../../kvs/CustomerServer');
var co = require('co');
var caseCarHandler = require('../cases/caseCarHandler');

var stepFieldMap = {
    1: 'time',
    2: 'origin',
    3: 'destination'
};

module.exports = function(user, message, callback){
    co(function* (){
        try{
            var carOrder = yield cskv.loadPlaceCaseAsync(user.wx_openid);
            if(carOrder && parseInt(carOrder) >= 2){
                carOrder.step = parseInt(carOrder) - 1;

                yield cskv.savePlaceCaseAsync(user.wx_openid, json);
                caseCarHandler(carOrder, user, carOrder[stepFieldMap[parseInt(carOrder.step)]]);
            }
            yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前没有可回滚的用车订单');
            return callback(new Error('no car order'), null);

        }catch(e){
            console.log(e)
        }

    })

};
