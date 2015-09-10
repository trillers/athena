var cskv = require('../CustomerService');
var userkv = require('../../../user/kvs/User');
var error = require('../../common/error.js');
var wechatApi = require('../../../wechat/common/api').api;
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');
var redis = require('../../../../app/redis-client')('pub');

module.exports = function* (message){
    var message = JSON.parse(message);
    var phone = message.phone, css;
    var errMsg = error.getErrorMessage(message.err, 'submit');
    try {
        var customerOpenId = yield userkv.loadOpenIdByPhoneAsync(phone);
        //var csOpenId = yield cskv.loadCsOpenIdAsync(customerOpenId);
        css = yield cskv.loadCSSByIdAsync(customerOpenId);

        var carOrder = yield cskv.loadPlaceCaseAsync(csOpenId);

        carOrder.payload.status = CaseStatusEnum.Draft.value();
        yield cskv.savePlaceCaseAsync(csOpenId, carOrder);
        var replyToCustomerService = '[系统]用车订单下单失败，失败原因：</br>'
            + errMsg + '</br>请确认后重新下单！';
        yield wechatApi.sendTextAsync(css.csId, replyToCustomerService);
    } catch(err){
        console.log('DDOrderRejectedHandler err:' + err);
    }
}
