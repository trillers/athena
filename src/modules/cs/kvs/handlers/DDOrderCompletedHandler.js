var cskv = require('../CustomerService');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');
var redis = require('../../../../app/redis-client')('pub');

module.exports = function* (message){
    var data = JSON.parse(message);
    var phone = data.phone;
    try {
        var customerId = yield userkv.loadOpenIdByPhoneAsync(phone);

        var replyToCustomer = '用车订单已完成，<a href="#">支付</a>';
        yield wechatApi.sendTextAsync(customerId, replyToCustomer);
    } catch(err){
        console.log('DDOrderCompletedHandler err:' + err);
    }
}
