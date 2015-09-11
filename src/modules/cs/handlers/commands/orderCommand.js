var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var CaseService = require('../../../case/services/CaseService');
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');
var carCaseWorkflow = require('../../../case/common/FSM').getWf('carCaseWorkflow');
var co = require('co');

module.exports = function(user, message, callback){
    co(function* (){
        try{
            var conversation = yield cskv.loadCSSByIdAsync(user.wx_openid);
            if(!conversation){
                yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前没有会话');
                return callback(new Error('no session'), null);
            }
            var userBiz = yield common.validateUserBindAsync(conversation.initiator);
            var params = {
                conditions: {
                    commissionerId: userBiz._id,
                    status: {$nin: [CaseStatusEnum.Complete.value(), CaseStatusEnum.Close.value(), CaseStatusEnum.Cancel.value()]}
                }
            }

            var caseArr = yield CaseService.find(params);
            if(caseArr.length > 0){
                var reply = '订单号       描述      状态     操作</br>';
                caseArr.forEach(function(item){
                    reply += formatCarOrder(item);
                });
                wechatApi.sendText(user.wx_openid, reply, function(err, result){
                    if(callback) return callback(err, result);
                });
            }else{
                wechatApi.sendText(user.wx_openid, '[系统]:当前无可操作的订单', function(err, result){
                    if(callback) return callback(err, result);
                });
            }

        }catch(e){
            console.log('orderCommand err:' + e);
        }

    })

};

function formatCarOrder(order){
    var caseNo = order.caseNo,
        from = order.origin,
        to = order.destination,
        status = CaseStatusEnum.values(order.status),
        action;
    if(carCaseWorkflow.canInWild('cancel', CaseStatusEnum.valueNames(order.status))){
        action = '<a href="http://ci.www.wenode.org/order/cancel?caseNo="' + caseNo + '>删除</a>';
    }else{
        action = '不可操作'
    }

    var reply = caseNo + '  从 ' + from + ' 到' + to + '的用车单       ' + status + '   ' + action;
    return reply;

}
