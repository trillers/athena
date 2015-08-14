var QrHandler = require('../common/QrHandler');
var UserService = require('../../user/services/UserService');
var UserBizService = require('../../user/services/UserBizService')
var logger = require('../../../app/logging').logger;
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');

var handle = function(message, user, res, qrChannel){
    //TODO: implementation
    var userUpdate = {
        wx_subscribe: 1,
        wx_subscribe_time: new Date(),
        $inc: {'subscribeCount': 1},
        role: UserRole.RegularUser.value()
    };

    UserService.updateAsync(user.id, userUpdate)
        .then(function(){
            var replyMsg = '欢迎注册！';
            res.reply(replyMsg);
        })
        .catch(Error, function(err){
            logger.error(err);
        });
};

var handler = new QrHandler(true, 'RU', handle); //RU regular user handler

module.exports = handler;
