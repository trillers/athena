var cskv = require('../CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;

module.exports = function* (message){
    var key = message;
    var customer;
    console.log('handle expire');
    var prefix = key.slice(0, 6);
    console.log('prefix======'+ prefix);
    var csId = key.slice(6);
    if(prefix == 'cs:st:') {
        try {
            var css = yield cskv.loadCSSByIdAsync(csId);
            if (css) customer = css.initiator;
            yield cskv.delCSSByIdAsync(csId);
            yield cskv.remWcCSSetAsync(csId);
            yield cskv.saveCSStatusByCSOpenIdAsync(csId, 'off');
            yield cskv.delWelcomeStatusAsync(customer);
            yield wechatApi.sendTextAsync(csId, '[系统]:长时间无交互，您已下线');
        } catch(err) {
            console.log('handle cs status tll expire: ' + err);
        }
    }
}
