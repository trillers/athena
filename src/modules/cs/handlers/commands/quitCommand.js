var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var co = require('co');

module.exports = function(user, message, callback){
    co(function* (){
        try{
            cskv.delPlaceCaseAsync(user.wx_openid)
                .then(function(){
                    if(callback) return callback(null, null);
                });
        }catch(e){
            console.log(e)
        }

    })

};
