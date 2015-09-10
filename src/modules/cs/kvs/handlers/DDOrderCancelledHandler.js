var cskv = require('../CustomerService');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var redis = require('../../../../app/redis-client')('pub');
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');

module.exports = function* (message){
    var data = JSON.parse(message);

    var phone = data.phone, css;
    var caseNo = data.caseNo;
    try {
        var customerOpenId = yield userkv.loadOpenIdByPhoneAsync(phone);
        //var csOpenId = yield cskv.loadCsOpenIdAsync(customerOpenId);
        css = yield cskv.loadCSSByIdAsync(customerOpenId);

        var replyToCustomerService = '[系统]：用车订单已取消，订单号：' + caseNo;
        yield wechatApi.sendTextAsync(css.csId, replyToCustomerService);
    } catch(err){
        console.log('DDOrderApplyingTimeoutHandler err:' + err);
    }
}
