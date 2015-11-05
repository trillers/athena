var csKvs = require('../../modules/cs/kvs/CustomerService');
var userService = require('../../modules/user/services/UserService');
var wechatUserService = require('../../modules/user/services/WechatUserService');
var UserRole = require('../../modules/common/models/TypeRegistry').item('UserRole');
var csState = require('../../modules/common/models/TypeRegistry').item('CSState');
var userKvs = require('../../modules/user/kvs/User');
var botManager = require('../../modules/assistant/botManager');
var wechatApi = require('../../modules/wechat/common/api').api;
var settings = require('athena-settings');

var Promise = require('bluebird');

module.exports = function(router) {
    router.post('/sendMsg', function*(){
        try{
            var msg = this.request.body.msg;
            var bot_uid = this.request.body.bot_uid;
            var bot_id = this.request.body.bot_id;
            var openid = this.request.body.openid;
            if(openid){
                yield wechatApi.sendTextAsync(openid, msg);
            }else if(bot_id){
                var message = {
                    ToUserName: bot_uid,
                    FromUserName: bot_id,
                    MsgType: 'text',
                    Content: msg
                }
                console.log('*************************');
                console.log(message);
                botManager.sendText(bot_id, message);
            }
            this.body = {success: true, err: null};
        }catch(err){
            console.error('load customer by id err: ' + err);
            this.body = {success: false, err: err};
        }
    });

    router.get('/load', function*(){
        try{
            var userId = this.query.id;
            var customer = yield userKvs.loadByIdAsync(userId);
            this.body = customer;
        }catch(err){
            console.error('load customer by id err: ' + err);
            this.body = null;
        }
    });

    router.get('/find', function*(){
        try{
            var customerList = yield userService.getRoleListAsync(UserRole.Customer.value());
            for(var i = 0; i < customerList.length; i++){
                if(customerList[i].sourceType === 'site'){
                    customerList[i].activeTime = yield userKvs.loadSessionTTLByOpenidAsync(customerList[i].wx_openid);
                    customerList[i].from = settings.wechat.siteName;
                }else if(customerList[i].sourceType === 'bot'){
                    customerList[i].from = botManager.getNameMap(customerList[i].bot_id)[customerList[i].bot_id];
                }
            }
            this.body = customerList;
        }catch(err){
            console.log('customer router find err:' + err);
            this.body = null;
        }
    });

    router.get('/snapshot', function*(){
        var res = {};
        var startTime = new Date();
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        try{
            var totalCustomerSum = yield userService.getDocSumAsync({role:UserRole.Customer.value()});
            var todayIncreaseSum = yield userService.getDocSumAsync({role:UserRole.Customer.value(), crtOn: {$gt: startTime}});
            res.totalCustomerSum = totalCustomerSum;
            res.todayIncreaseSum = todayIncreaseSum;
            this.body = res;
        }catch(err){
            console.log('customer router snapshot err: ' + err);
            this.body = null;
        }
    });
}