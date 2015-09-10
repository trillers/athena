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
    var phone = data.phone;
    try {
        var customerId = yield userkv.loadOpenIdByPhoneAsync(phone);
        //TODO
    } catch(err){
        console.log('DDOrderInserviceHandler err:' + err);
    }
}
