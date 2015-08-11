var QrHandler = require('../common/QrHandler');
var ClazzService = require('../../../services/ClazzService');
var ClazzBriefService = require('../../../services/ClazzBriefService');
var UserService = require('../../../services/UserService');
var UserBizService = require('../../../services/UserBizService');
var ClazzStudentService = require('../../../services/ClazzStudentService');
var wechatApi = require('../../../app/wechat/api').api;
var Promise = require('bluebird');
var UserRole = require('../../../models/TypeRegistry').item('UserRole');

var tutorMediaId = "9Qx2NY4keMALv37HdZ-XfJjCsNWy1w5l3Kmar0zJc2DBtBb1fFRa_nRUv57RFv4P";
var _replyMsg = "识别下面的二维码,可以添加您的小助手哦~";

var handle = function(message, user, res, qrChannel){
    var update = {
            wx_subscribe: 1,
            wx_subscribe_time: new Date(),
            $inc: {'subscribeCount': 1},
            role: UserRole.Student.value()
        },
        clazzStudentId;

    UserService.update(user.id, update)
        .then(function(){
            res.reply(_replyMsg);
            return ClazzStudentService.createAsync({user: user.id, headUrl: user.wx_headimgurl, name: user.wx_nickname});
        })
        .then(function(clazzStudent){
            clazzStudentId = clazzStudent._id;
            return ClazzService.loadByQrChannelIdAsync(qrChannel._id);
        })
        .then(function(clazz){
            return ClazzService.addStudentAsync(clazz._id, clazzStudentId, user.id);
        })
        .then(function(clazz){
            return ClazzBriefService.loadByClazzIdAsync(clazz._id);
        })
        .then(function(clazzBrief){
            var userBiz = {
                $addToSet: {clazzes: clazzBrief._id}
            }
            return UserBizService.updateByConditionAsync({user: user.id}, userBiz);
        })
        .then(function(userBiz){
            if(userBiz){
                return wechatApi.sendImageAsync(user.wx_openid, tutorMediaId);
            }else{
                throw new Error("class Failed to bind Student!");
            }
        })
        .catch(Error, function(err){
            console.log(err);
        });
};

module.exports = new QrHandler(true, 'SBC', handle);
