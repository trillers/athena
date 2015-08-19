var QrHandler = require('../common/QrHandler');
var UserService = require('../../user/services/UserService');
var UserBizService = require('../../user/services/UserBizService')
var logger = require('../../../app/logging').logger;
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');

var handle = function* (message, user, ctx, qrChannel){
    //TODO: implementation
    var userUpdate = {
        wx_subscribe: 1,
        wx_subscribe_time: new Date(),
        $inc: {'subscribeCount': 1},
        role: UserRole.CustomerServer.value()
    };

    try{
        yield UserService.updateAsync(user.id, userUpdate);
    } catch (err){
        logger.error(err);
    }

    var replyMsg = '欢迎注册成为客服人员！';
    console.log('reply');
    console.log(ctx);
    ctx.body = replyMsg;
};

var handler = new QrHandler(true, 'CS', handle); //CS customer server handler

module.exports = handler;
