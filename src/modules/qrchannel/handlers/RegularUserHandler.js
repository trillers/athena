//var QrHandler = require('../common/QrHandler');
//var ChannelService = require('../../../services/ChannelService');
//var UserService = require('../../../services/UserService');
//var logger = require('../../../app/logging').logger;
//
//var handle = function(message, user, res, replyMsg, qrChannel){
//    //TODO: implementation
//    console.log('++++++++');
//    console.log('cc handler');
//    console.log(replyMsg);
//    console.log(user);
//    var update = {
//        wx_subscribe: 1,
//        wx_subscribe_time: new Date(),
//        $inc: {'subscribeCount': 1}
//    };
//    console.log(user.subscribeCount == 0);
//    console.log(typeof user.subscribeCount);
//    if(user.subscribeCount == 0){
//        update.channelFrom = qrChannel.scene_id;
//        ChannelService.followAsync(qrChannel.scene_id)
//            .then(function(){
//                UserService.tempUpdate(user.id, update, function(err, result){
//                    if(err){
//                        logger.error('user subscribe event error ' + err);
//                    }
//                    console.log('44444');
//                    res.reply(replyMsg);
//                });
//            });
//    }else{
//        UserService.tempUpdate(user.id, update, function(err, result){
//            if(err){
//                logger.error('user subscribe event error ' + err);
//            }
//            res.reply(replyMsg);
//        });
//    }
//};
//
//var handler = new QrHandler(true, 'CC', handle); //Custom channel of organization
//
//module.exports = handler;