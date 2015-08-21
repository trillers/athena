var Promise = require('bluebird');
var userBizService = require('../../../user/services/userBizService');
function validateUserBind(user, callback){
    return userBizService.loadAsync(user.wx_openid)
    .then(function(userBiz){
        if(userBiz.phone){
            return callback(null, true);
        }
        return callback(null, false);
    })
}
module.exports.validateUserBindAsync = validateUserBind;