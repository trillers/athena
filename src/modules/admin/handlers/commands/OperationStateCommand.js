/**
 * when admin send '运营状态', return the sum of admin, customer , cs and today conversation sum
 */
var wechatApi = require('../../../wechat/common/api').api;
var logger = require('../../../../app/logging').logger;
var cvsService = require('../../../conversation/services/ConversationService');
var userService = require('../../../user/services/UserService');
var UserRole = require('../../../common/models/TypeRegistry').item('UserRole');

var co = require('co');

module.exports = function(message, userOpenid){
    if (message.trim() === '运营状态') {
        co(function*(){
            try {
                var adminSum = yield userService.getRoleSumAsync(UserRole.Admin.value());
                var csSum = yield userService.getRoleSumAsync(UserRole.CustomerService.value());
                var customerSum = yield userService.getRoleSumAsync(UserRole.Customer.value());
                var todayCvsSum = yield cvsService.getTodayCvsSumAsync();

                var reply = '管理员人数：' + adminSum + '\n'
                    + '客服人数：' + csSum + '\n'
                    + '客户数：' + customerSum + '\n'
                    + '今天会话数：' + todayCvsSum;

                wechatApi.sendText(userOpenid, reply, function (err, data) {
                    if (err) {
                        return logger.error('wechat send operation state err:' + err);
                    }
                    console.log('success to send operation state');
                });
            }catch(err){
                console.error('query operation state err:' + err)
                wechatApi.sendText(userOpenid, '系统繁忙，请稍后重试！', function (err, data) {
                    if (err) {
                        return logger.error('wechat send operation state err:' + err);
                    }
                });
            }
        });
    }
}