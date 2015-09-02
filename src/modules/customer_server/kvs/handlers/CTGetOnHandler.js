var cskv = require('../CustomerServer');
var caseKv = require('../../../case/kvs/CaseServer');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var CaseStatusEnum = require('../../common/models/TypeRegistry').item('CaseStatus');
var caseService = require('../../../case/services/CaseService');
var caseTaxiService = require('../../../case/services/CaseTaxiService');
var settings = require('athena-settings').redis;
var redis = require('redis').createClient(settings.port, settings.host, {auth_pass: settings.auth});
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');

module.exports = function(message){
    var data = JSON.parse(message);
    var phone = data.phone,
        status = CaseStatusEnum.Inservice.value(),
        caseNo = data.caseNo,
        caseId;

    userkv.loadOpenIdByPhoneAsync(phone)
        .then(function(openId){
            return caseKv.loadCaseStatusAsync(caseNo, phone);
        })
        .then(function(caseStatus){
            caseStatus.status = status;
            caseId = caseStatus.caseId;
            return caseKv.saveCaseStatusAsync(caseNo, phone, caseStatus);
        })
        .then(function(){
            try{
                var caseUpdate = {status: status}
                yield caseService.update(caseId, caseUpdate);
            } catch (err){
                //todo
                //var cancelInfo = {caseNo: caseNo, phone: phone};
                //redis.publish('taxi cancel', JSON.stringify(cancelInfo));
                return console.log('数据库订单更新到Inservice状态失败：caseNo:' + caseNo + ' phone:' + phone);
            }
        })
        .catch(Error, function(err){
            console.log('CTGetOnHandler err:' + err);
        });
}
