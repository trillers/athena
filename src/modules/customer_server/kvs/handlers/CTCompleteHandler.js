var cskv = require('../CustomerServer');
var caseKv = require('../../../case/kvs/CaseServer');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var CaseStatusEnum = require('../../common/models/TypeRegistry').item('CaseStatus');
var caseService = require('../../../case/services/CaseService');
var redis = require('../../../../app/redis-client')('pub');
var caseTaxiService = require('../../../case/services/CaseTaxiService');

module.exports = function(message){
    var data = JSON.parse(message);
    var phone = data.phone,
        caseNo = data.caseNo,
        caseUpdate = {
            status: CaseStatusEnum.UnPay.value(),
            cost: data.cost
        },
        caseTaxiUpdate = {
            mileage: data.mileage
        },
        customerId;
    userkv.loadOpenIdByPhoneAsync(phone)
        .then(function(openId){
            customerId = openId;
            return caseKv.loadCaseStatusAsync(caseNo, phone);
        })
        .then(function(caseStatus){
            var caseId = caseStatus.caseId;
            yield caseKv.delCaseStatusAsync(caseNo, phone);
            try{
                yield caseService.update(caseId, caseUpdate);
                yield caseTaxiService.updateByConditionAsync({'case': caseId}, caseTaxiUpdate);
            } catch (err){
                //todo
                //var cancelInfo = {caseNo: caseNo, phone: phone};
                //redis.publish('taxi cancel', JSON.stringify(cancelInfo));
                return console.log( '数据库订单更新Complete状态失败, caseNo:' + caseNo + ' phone:' + phone);
            }

            var replyToCustomer = '用车订单已完成，<a href="#">支付</a>';
            yield wechatApi.sendTextAsync(customerId, replyToCustomer);
        })
        .catch(Error, function(err){
            console.log('CTCompleteHandler err:' + err);
        });
}
