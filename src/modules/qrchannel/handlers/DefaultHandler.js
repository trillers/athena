//var UserService = require('../../../services/UserService');
//var logger = require('../../../app/logging').logger;
//
//var handle = function(message, user, res, replyMsg, qrChannel){
//    //TODO: implementation
//    var update = {
//        wx_subscribe: 1,
//        wx_subscribe_time: new Date(),
//        $inc: {'subscribeCount': 1}
//    };
//
//    UserService.tempUpdate(user.id, update, function(err, result){
//        if(err){
//            logger.error('user subscribe event error ' + err);
//        }
//        res.reply(replyMsg);
//    });
//};
//
//module.exports = handle;