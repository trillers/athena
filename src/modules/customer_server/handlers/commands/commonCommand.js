var Promise = require('bluebird');
var userBizService = require('../../../user/services/UserBizService');
function validateUserBind(user, callback){
    userBizService.loadAsync(user.wx_openid)
    .then(function(userBiz){
        if(userBiz.phone){
            return callback(null, true);
        }
        return callback(null, false);
    })
}
module.exports.validateUserBindAsync = Promise.promisify(validateUserBind);