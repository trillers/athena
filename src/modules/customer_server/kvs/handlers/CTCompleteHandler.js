var cskv = require('../CustomerServer');
var caseKv = require('../../../case/kvs/CaseServer');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');
var caseService = require('../../../case/services/CaseService');
var redis = require('../../../../app/redis-client')('pub');
var caseCarService = require('../../../case/services/CaseCarService');

module.exports = function* (message){
    var data = JSON.parse(message);
    var phone = data.phone,
        caseNo = data.caseNo,
        caseUpdate = {
            status: CaseStatusEnum.UnPay.value(),
            cost: data.cost
        },
        caseCarUpdate = {
            mileage: data.mileage
        };
    try {
        var customerId = yield userkv.loadOpenIdByPhoneAsync(phone);
        var caseStatus = yield caseKv.loadCaseStatusAsync(caseNo, phone);
        var caseId = caseStatus.caseId;
        yield caseKv.delCaseStatusAsync(caseNo, phone);
        try {
            yield caseService.update(caseId, caseUpdate);
            yield caseCarService.updateByConditionAsync({'case': caseId}, caseCarUpdate);
        } catch (err) {
            //todo
            //var cancelInfo = {caseNo: caseNo, phone: phone};
            //redis.publish('car_cancel', JSON.stringify(cancelInfo));
            return console.log('数据库订单更新Complete状态失败, caseNo:' + caseNo + ' phone:' + phone);
        }

        var replyToCustomer = '用车订单已完成，<a href="#">支付</a>';
        yield wechatApi.sendTextAsync(customerId, replyToCustomer);
    } catch(err){
        console.log('CTCompleteHandler err:' + err);
    }
}
