var co = require('co');
var logger = require('../../../../app/logging').logger;
var botManager = require('../../../assistant/botManager');
var wechatApi = require('../../../wechat/common/api').api;

module.exports = function (context) {
    var openid = context.weixin.FromUserName;
    var bucketid = context.weixin.ToUserName;
    co(function*() {
        try {
            botManager.stop({bucketid: bucketid, openid: openid});
            yield wechatApi.sendTextAsync(openid, '[系统]: 微信助手['+ bucketid + ':' +openid +']停止命令已发送！');
            logger.info('Succeed to send "stop" command for wechat bot ['+ bucketid + ':' +openid +']!');
        } catch (err) {
            logger.error('Fail to stop bot ['+ bucketid + ':' +openid +']:' + err)
            logger.log(err.stack);
        }
    });
}