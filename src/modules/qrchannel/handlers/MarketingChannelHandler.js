//var QrHandler = require('../common/QrHandler');
//var UserService = require('../../../services/UserService');
//var MarketingCampaignService = require('../../../services/MarketingCampaignService');
//var MarketingCampaignUserService = require('../../../services/MarketingCampaignUserService');
//var MarketingCashPackService = require('../../../services/MarketingCashPackService');
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
//    if(user.subscribeCount ==0 ){
//        MarketingCampaignUserService.findByQrChannel({'user.qrChannel': qrChannel._id}, function(err, mcus){
//            console.log('=======qrChannel==-======');
//            console.log(qrChannel);
//            if(err){
//                logger.error('MarketingChannelHandler load muc err: ' + err);
//                return;
//            }
//            if(mcus.length === 0){
//                logger.error('MarketingChannelHandler load muc err: expired qrcode');
//                return;
//            }
//            console.log('===========share send redpack============');
//            console.log(mcus[0]);
//            MarketingCampaignUserService.update(mcus[0]._id, {$push: {'user.contact': {id: user.id}}, $inc: {'user.contactCount': 1}}, function(err, result){
//                if(err){
//                    logger.error('MarketingChannelHandler send redpack update mcu failed: ' + err);
//                }else{
//                    if(mcus[0].user.contactCount > 0 && (mcus[0].user.contactCount % 2 === 0)){
//                        MarketingCashPackService.sendRedPackWrapper(mcus[0], 100, 110, '分享多多,红包多多！', function(err, result){
//                            if(err){
//                                logger.error('MarketingChannelHandler send redpack failed: ' + err);
//                            }else{
//                                MarketingCampaignUserService.update(mcus[0]._id, {$push: {'user.contact': {id: user.id}}, $inc: {'user.contactCount': 1}}, function(err, result){
//                                    if(err){
//                                        logger.error('MarketingChannelHandler send redpack update mcu failed: ' + err);
//                                    }else{
//                                        logger.info('MarketingChannelHandler send redpack success');
//                                    }
//                                })
//                            }
//                        });
//                    }
//                }
//            })
//        });
//    }
//
//
//    UserService.tempUpdate(user.id, update, function(err, result){
//        if(err){
//            logger.error('user subscribe event error ' + err);
//        }
//        res.reply(replyMsg);
//    });
//};
//
//var handler = new QrHandler(false, 'MC', handle); //Marketing channel of organization
//
//module.exports = handler;