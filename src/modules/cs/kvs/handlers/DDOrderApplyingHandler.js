var cskv = require('../CustomerService');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var redis = require('../../../../app/redis-client')('pub');
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');

module.exports = function* (message){
    var data = JSON.parse(message);

    var phone = data.phone, css;
    try {
        var customerOpenId = yield userkv.loadOpenIdByPhoneAsync(phone);
        //var csOpenId = yield cskv.loadCsOpenIdAsync(customerOpenId);
        css = yield cskv.loadCSSByIdAsync(customerOpenId);
        var carOrder = yield cskv.loadPlaceCaseAsync(csOpenId);

        carOrder.payload.status = CaseStatusEnum.Applying.value();
        yield cskv.savePlaceCaseAsync(csOpenId, carOrder);

        var replyToCustomer = '已为你叫车，等待师傅接单';

        var replyToCustomerService = '[系统]：叫车成功，等待师傅接单';
        yield wechatApi.sendTextAsync(css.csId, replyToCustomerService);
        yield wechatApi.sendTextAsync(css.initiator, replyToCustomer);
    } catch(err){
        console.log('DDOrderApplyingHandler err:' + err);
    }
}
