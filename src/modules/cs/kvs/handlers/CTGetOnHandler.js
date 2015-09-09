var cskv = require('../CustomerService');
var caseKv = require('../../../case/kvs/CaseServer');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');
var caseService = require('../../../case/services/CaseService');
var caseCarService = require('../../../case/services/CaseCarService');
var redis = require('../../../../app/redis-client')('pub');
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');

module.exports = function* (message){
    var data = JSON.parse(message);
    var phone = data.phone,
        status = CaseStatusEnum.Inservice.value(),
        caseNo = data.caseNo,
        caseId;
    try {
        var caseStatus = yield caseKv.loadCaseStatusAsync(caseNo, phone);
        caseStatus.status = status;
        caseId = caseStatus.caseId;
        yield caseKv.saveCaseStatusAsync(caseNo, phone, caseStatus);
        try {
            var caseUpdate = {status: status}
            yield caseService.update(caseId, caseUpdate);
        } catch (err) {
            //todo
            //var cancelInfo = {caseNo: caseNo, phone: phone};
            //redis.publish('car_cancel', JSON.stringify(cancelInfo));
            return console.log('数据库订单更新到Inservice状态失败：caseNo:' + caseNo + ' phone:' + phone);
        }
    } catch(err){
        console.log('CTGetOnHandler err:' + err);
    }
}
