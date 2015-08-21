var Promise = require('bluebird');
var userBizService = require('../../../user/services/userBizService');
function validateUserBind(user, callback){
    userBizService.loadAsync(user.wx_openid)
    .then(function(userBiz){
        if(userBiz.phone){
            return callback
        }
    })
}
module.exports.validateUserBindAsync = Promise.promisify(validateUserBind);