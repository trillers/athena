var cskv = require('../CustomerServer');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var caseService = require('../../../case/services/CaseService');

module.exports = function(message){
    var data = JSON.parse(message);
    if(data.err){
        return;
    }
    var phone = data.phone;
    var status = data.status;
    userkv.loadOpenIdByPhoneAsync(phone)
        .then(function(openId){
            wechatApi.sendText(openId, '下单成功', function(){
                console.log('user:' + openId + ' 用车单下单成功');
            })
            return cskv.loadCSSByIdAsync(openId);
        })
        .then(function(css){
            var csOpendId = css.csId;
            wechatApi.sendText(csOpendId, '下单成功', function(){
                console.log('user:' + openId + ' 用车单下单成功');
            })
        })
}
