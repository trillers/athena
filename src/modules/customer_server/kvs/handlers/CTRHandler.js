var cskv = require('../CustomerServer');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var CaseStatusEnum = require('../../common/models/TypeRegistry').item('CaseStatus');
var caseService = require('../../../case/services/CaseService');
var redis = require('redis').createClient();

module.exports = function(message){
    var data = JSON.parse(message);
    if(data.err){
        return;
    }
    var phone = data.phone,
        caseNo = data.caseNo,
        css;
    userkv.loadOpenIdByPhoneAsync(phone)
        .then(function(openId){
            return cskv.loadCSSByIdAsync(openId);
        })
        .then(function(data){
            css = data;
            var csOpenId = css.csId;
            return cskv.loadPlaceCaseAsync(csOpenId);
        })
        .then(function(data){
            var txCase = data.payload;
            try{
                yield caseService.createAsync(txCase);
            } catch (err){
                //todo
                var cancelInfo = {caseNo: caseNo, phone: phone};
                redis.publish('taxi cancel', JSON.stringify(cancelInfo));
                yield wechatApi.sendTextAsync(css.csId, '订单保存到数据库失败，已自动取消订单，请重新下单！');
                return;
            }
            yield cskv.delPlaceCaseAsync(css.csId);
            var replyToCustomer = '已为你叫车，等待师傅接单';

            var replyToCustomerServer = '叫车成功，等待师傅接单';
            yield wechatApi.sendTextAsync(css.csId, replyToCustomerServer);
            yield wechatApi.sendTextAsync(css.initiator, replyToCustomer);
        })
        .catch(Error, function(err){
            console.log('call taxi response err:' + err);
        });
}
