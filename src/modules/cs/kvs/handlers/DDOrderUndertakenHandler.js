var cskv = require('../CustomerService');
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
        arriveTime = data.arriveTime,
        origin = data.origin,
        destination = data.destination,
        driverName = data.driverName,
        driverPhone = data.driverPhone,
        carLicensePlate = data.carLicensePlate,
        carModel = data.carModel,
        carType = data.carType,
        estimatedCost = data.estimatedCost,
        css;
    try {
        var customerOpenId = yield userkv.loadOpenIdByPhoneAsync(phone);
        //var csOpenId = yield cskv.loadCsOpenIdAsync(customerOpenId);
        css = yield cskv.loadCSSByIdAsync(customerOpenId);
        yield cskv.delPlaceCaseAsync(csOpenId);

        var replyToCustomer = '司机预计' + arriveTime + '分钟后到，请稍等。</br>'
            + '-------------------------------------'
            + '起点：        ' + origin + '</br>'
            + '终点：        ' + destination + '</br>'
            + '用车类型：     ' + carType + '</br>'
            + '司机：     ' + driverName + '</br>'
            + '司机电话：     ' + driverPhone + '</br>'
            + '车牌号：      ' + carLicensePlate + '</br>'
            + '车型：        ' + carModel + '</br>'
            + '预估费用：     ' + estimatedCost + '</br>';

        var replyToCustomerService = '[系统]：已接单' + '</br>'
            + '司机预计' + arriveTime + '分钟后到达。</br>'
            + '-------------------------------------'
            + '起点：        ' + origin + '</br>'
            + '终点：        ' + destination + '</br>'
            + '用车类型：     ' + carType + '</br>'
            + '司机：     ' + driverName + '</br>'
            + '司机电话：     ' + driverPhone + '</br>'
            + '车牌号：      ' + carLicensePlate + '</br>'
            + '车型：        ' + carModel + '</br>'
            + '预估费用：     ' + estimatedCost + '</br>';
        yield wechatApi.sendTextAsync(css.csId, replyToCustomerService);
        yield wechatApi.sendTextAsync(css.initiator, replyToCustomer);
    } catch(err){
        console.log('CTCarryHandler err:' + err);
    }
}
