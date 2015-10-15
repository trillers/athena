var cskv = require('../CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var cvsService = require('../../../conversation/services/ConversationService');
var cvsKv = require('../../../conversation/kvs/Conversation');
module.exports = function* (message){
    var key = message;
    var customer;
    console.log('handle expire');
    var prefix = key.slice(0, 6);
    console.log('prefix======'+ prefix);
    var csId = key.slice(6);
    if(prefix == 'cs:st:') {
        try {
            var cvs = yield cvsKv.loadByIdAsync(csId);
            yield cvsService.closeAsync(cvs);
            //if (css) customer = css.initiator;
            yield cskv.saveCSStatusByCSOpenIdAsync(csId, 'off');
            //yield cskv.delWelcomeStatusAsync(customer);
            yield wechatApi.sendTextAsync(csId, '[系统]:长时间无交互，您已下线');
        } catch(err) {
            console.log('handle cs status tll expire: ' + err);
        }
    }
}
