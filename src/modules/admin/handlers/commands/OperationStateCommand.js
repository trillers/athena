/**
 * when admin send '运营状态', return the sum of admin, customer , cs and today conversation sum
 */
var wechatApi = require('../../../wechat/common/api').api;
var logger = require('../../../../app/logging').logger;
var cvsService = require('../../../conversation/services/ConversationService');
var userService = require('../../../user/services/UserService');
var UserRole = require('../../../common/models/TypeRegistry').item('UserRole');
var csKvs = require('../../../cs/kvs/CustomerService');
var Promise = require('bluebird');
var co = require('co');

module.exports = function (context) {
    var openid = context.weixin.FromUserName;
    co(function*() {
        try {
            var adminList = yield userService.getRoleListAsync(UserRole.Admin.value());
            var adminSum = adminList.length;
            var adminListStr = getAdminListReplyStr(adminList);
            var csList = yield userService.getRoleListAsync(UserRole.CustomerService.value());
            var csSum = csList.length;
            var csListStr = yield getCsListReplyStrAsync(csList);

            var customerSum = yield userService.getRoleSumAsync(UserRole.Customer.value());
            var todayCvsSum = yield cvsService.getTodayCvsSumAsync();

            var reply = '[系统]: \n'
                + '管理员人数: ' + adminSum + '\n'
                + adminListStr +'\n'
                + '客服人数: ' + csSum + '\n'
                + csListStr +'\n'
                + '客户人数：    ' + customerSum + '\n\n'
                + '今天会话数：' + todayCvsSum + '\n';

            wechatApi.sendText(openid, reply, function (err, data) {
                if (err) {
                    return logger.error('wechat send operation state err:' + err);
                }
                console.log('success to send operation state');
            });
        } catch (err) {
            console.error('query operation state err:' + err)
            wechatApi.sendText(openid, '[系统]: 系统繁忙，请稍后重试！', function (err, data) {
                if (err) {
                    return logger.error('wechat send operation state err:' + err);
                }
            });
        }
    });
}
var csStateMap = {
    'off': '离线',
    'ol': '在线',
    'busy': '忙碌'
}

var getCsListReplyStr = function (csList, callback) {
    var replyStr = '';
    var actionArr = [];
    csList.forEach(function (item) {
        actionArr.push(csKvs.loadCSStatusByCSOpenIdAsync(item.wx_openid));
    });
    Promise.all(actionArr)
        .then(function(arr){
            arr.forEach(function(item, index){
                replyStr += csList[index].wx_nickname + '(' + (csStateMap[item] || '未知') + ')\n';
            });
            if(callback) return callback(null, replyStr);
        });
}

var getCsListReplyStrAsync = Promise.promisify(getCsListReplyStr);
var getAdminListReplyStr = function(adminList){
    var replyStr = '';
    adminList.forEach(function(item){
        replyStr += item.wx_nickname + '\n';
    })
    return replyStr;
}