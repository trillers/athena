var cskv = require('../CustomerService');
var caseKv = require('../../../case/kvs/CaseServer');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var caseService = require('../../../case/services/CaseService');
var caseCarService = require('../../../case/services/CaseCarService');
var redis = require('../../../../app/redis-client')('pub');
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');

module.exports = function* (message){
    var data = JSON.parse(message);
    if(data.err){
        return;
    }
    var phone = data.phone,
        caseNo = data.caseNo,
        css;
    try {
        var openId = yield userkv.loadOpenIdByPhoneAsync(phone);
        css = yield cskv.loadCSSByIdAsync(openId);
        var csOpenId = css.csId;
        var caseCar = yield cskv.loadPlaceCaseAsync(csOpenId);
        var caseId = caseCar.payload.caseId;
        var caseStatus = {
            caseId: caseId,
            status: CaseStatusEnum.Applying.value()
        }
        yield cskv.delPlaceCaseAsync(css.csId);
        yield caseKv.saveCaseStatusAsync(caseNo, phone, caseStatus);
        try {
            var caseUpdate = {status: CaseStatusEnum.Applying.value(), caseNo: caseNo}
            yield caseService.update(caseId, caseUpdate);
        } catch (err) {
            //todo
            var cancelInfo = {caseNo: caseNo, phone: phone};
            redis.publish('car_cancel', JSON.stringify(cancelInfo));
            yield wechatApi.sendTextAsync(css.csId, '订单保存到数据库失败，已自动取消订单，请重新下单！');
            return;
        }
        yield cskv.delPlaceCaseAsync(css.csId);
        var replyToCustomer = '已为你叫车，等待师傅接单';

        var replyToCustomerService = '叫车成功，等待师傅接单';
        yield wechatApi.sendTextAsync(css.csId, replyToCustomerService);
        yield wechatApi.sendTextAsync(css.initiator, replyToCustomer);
    } catch(err){
        console.log('CTResolveHandler err:' + err);
    }
}
