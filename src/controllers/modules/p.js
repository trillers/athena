var path = require('path');
var views = require('co-views');
var render= views(path.join(__dirname, '../../views'), { map: { html: 'swig' }});
var cskv = require('../../modules/customer_server/kvs/CustomerServer');
var userBizService = require('../../modules/user/services/UserBizService')
var wechatApi = require('../../modules/wechat/common/api').api;
module.exports=function(router){
    router.get('/userbind', function* (){
        this.body = yield render('user-bind');
    })
    router.post('/validateIc', function* (){
        var data = this.request.body;
        var phone = data.phone;
        var ic = data.ic;
        //var user = this.session.user;
        var user = {
            wx_openid: 'okvXqswFmgRwEV0YrJ-h5YvKhdUk',
            _id: '1232'
        }
        this.status = 200;
        this.body = {result: 'ok'}
        try{
            var result = yield cskv.loadCSSByIdAsync(user.wx_openid)
            if(result){
                var updateOrNot = yield userBizService.updateByConditionAsync({wx_openid: user.wx_openid}, {phone: phone})
                if(!updateOrNot){
                    var json = {
                        user: user._id,
                        wx_openid: user.wx_openid,
                        phone: phone
                    }
                    yield userBizService.createAsync(json);
                }
                yield wechatApi.sendTextAsync(result.csId, '[系统]:绑定用户成功');
            }
        }catch(e){
            console.log(e)
        }
        return;
    })
    router.post('/getIc', function* (){
        console.log(222222)
        this.status = 200;
    })
}