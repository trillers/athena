var co = require('co');
var wechatApi = require('../../../wechat/common/api').api;

var CommandRegistry = require('../../../../framework/wechat/command-registry');
var registry = new CommandRegistry();
registry.addCommand('账户邀请二维码', require('../commands/requestOrgRegistrationQrCodeCommand'));

module.exports = function(emitter){
    emitter.po(function(event, context){
        co(function*(){
            var handler = registry.extractCommandFromContext(context);
            if(handler){
                handler();
            }
            else{

            }
        });
    });
};