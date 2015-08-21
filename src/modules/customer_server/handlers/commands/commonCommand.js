var Promise = require('bluebird');
var userBizService = require('../../../user/services/UserBizService');
function validateUserBind(openid, callback){
    return userBizService.loadAsync(openid)
    .then(function(userBiz){
        if(userBiz.phone){
            return callback(null, true);
        }
        return callback(null, false);
    })
}
module.exports.validateUserBindAsync = validateUserBind;