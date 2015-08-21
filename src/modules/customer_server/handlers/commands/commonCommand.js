var Promise = require('bluebird');
var userBizService = require('../../../user/services/UserBizService');
function validateUserBind(openid, callback){
    userBizService.loadByOpenidAsync(openid)
    .then(function(userBiz){
        if(userBiz && userBiz.phone){
            return callback(null, true);
        }
        return callback(null, false);
    })
}
module.exports.validateUserBindAsync = Promise.promisify(validateUserBind);