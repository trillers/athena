var path = require('path');
var views = require('co-views');
var render= views(path.join(__dirname, '../../views'), { map: { html: 'swig' }});
var wechatApi = require('../../modules/wechat/common/api').api;
var redis = require('../../app/redis-client')('pub');

module.exports=function(router){
    router.get('/cancel', function* (){
        console.log('++++++++++++++++++++++++');
        var caseNo = this.query.caseNo;
        var csOpenId = this.query.csOpenId;
        redis.publish('DDOrderCancel', caseNo);
        yield wechatApi.sendTextAsync(csOpenId, '[系统]:取消订单请求已发送');

        this.body = yield render('order-cancel');
    })
}