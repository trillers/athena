var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var CaseService = require('../../../case/services/CaseService');
var CaseStatusEnum = require('../../common/models/TypeRegistry').item('CaseStatus');
var co = require('co');

module.exports = function(user, message, callback){
    co(function* (){
        try{
            var conversation = yield cskv.loadCSSByIdAsync(user.wx_openid);
            if(!conversation){
                yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前没有会话');
                return callback(new Error('no session'), null);
            }
            var userBiz = yield common.validateUserBindAsync(conversation.initiator);
            var params = {
                conditions: {
                    commissionerId: userBiz._id,
                    status: {$nin: [CaseStatusEnum.Complete.value(), CaseStatusEnum.Close.value(), CaseStatusEnum.Cancel.value()]}
                }
            }

            var caseArr = yield CaseService.find(params);

        }catch(e){
            console.log('cancelCommand err:' + e);
        }

    })

};
