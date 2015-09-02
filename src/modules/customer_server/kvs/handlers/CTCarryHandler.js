var cskv = require('../CustomerServer');
var caseKv = require('../../../case/kvs/CaseServer');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');
var caseService = require('../../../case/services/CaseService');
var redis = require('../../../../app/redis').createClient();
var caseTaxiService = require('../../../case/services/CaseTaxiService');

module.exports = function* (message){
    var data = JSON.parse(message);
    var phone = data.phone,
        caseNo = data.caseNo,
        status = CaseStatusEnum.Undertake.value(),
        arriveTime = data.arriveTime,
        caseTaxiUpdate = {
            driverName: data.driverName,
            driverPhone: data.driverPhone,
            carLicensePlate: data.carLicensePlate,
            carModel: data.carModel,
            carType: data.carType,
            estimatedCost: data.estimatedCost
        },
        css;
    try {
        var openId = yield userkv.loadOpenIdByPhoneAsync(phone);
        css = yield cskv.loadCSSByIdAsync(openId);
        var caseStatus = yield caseKv.loadCaseStatusAsync(caseNo, phone);
        var caseId = caseStatus.caseId;
        caseStatus.status = status;
        yield caseKv.saveCaseStatusAsync(caseNo, phone, caseStatus);
        try {
            yield caseService.update(caseId, {status: status});
            yield caseTaxiService.updateByConditionAsync({'case': caseId}, caseTaxiUpdate);
        } catch (err) {
            //todo
            var cancelInfo = {caseNo: caseNo, phone: phone};
            //redis.publish('taxi cancel', JSON.stringify(cancelInfo));
            yield wechatApi.sendTextAsync(css.csId, '数据库订单更新失败');
            return;
        }
        var replyToCustomer = '司机预计' + arriveTime + '分钟后到，请稍等。</br>'
            + '-------------------------------------'
            + '起点：        ' + caseTaxiUpdate.origin + '</br>'
            + '终点：        ' + caseTaxiUpdate.destination + '</br>'
            + '用车类型：     ' + caseTaxiUpdate.carType + '</br>'
            + '司机电话：     ' + caseTaxiUpdate.driverPhone + '</br>'
            + '车牌号：      ' + caseTaxiUpdate.carLicensePlate + '</br>'
            + '车型：        ' + caseTaxiUpdate.carModel + '</br>'
            + '预估费用：     ' + caseTaxiUpdate.estimatedCost + '</br>';

        var replyToCustomerServer = '已接单' + '</br>'
            + '司机预计' + arriveTime + '分钟后到达。</br>'
            + '-------------------------------------'
            + '起点：        ' + caseTaxiUpdate.origin + '</br>'
            + '终点：        ' + caseTaxiUpdate.destination + '</br>'
            + '用车类型：     ' + caseTaxiUpdate.carType + '</br>'
            + '司机电话：     ' + caseTaxiUpdate.driverPhone + '</br>'
            + '车牌号：      ' + caseTaxiUpdate.carLicensePlate + '</br>'
            + '车型：        ' + caseTaxiUpdate.carModel + '</br>'
            + '预估费用：     ' + caseTaxiUpdate.estimatedCost + '</br>';
        yield wechatApi.sendTextAsync(css.csId, replyToCustomerServer);
        yield wechatApi.sendTextAsync(css.initiator, replyToCustomer);
    } catch(err){
        console.log('CTCarryHandler err:' + err);
    }
}
