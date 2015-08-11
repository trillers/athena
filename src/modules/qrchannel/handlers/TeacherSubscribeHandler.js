var QrHandler = require('../common/QrHandler');
var UserService = require('../../../services/UserService');
var ClazzTeacherService = require('../../../services/ClazzTeacherService')
var logger = require('../../../app/logging').logger;
var UserRole = require('../../../models/TypeRegistry').item('UserRole');

var handle = function(message, user, res, qrChannel){
    //TODO: implementation
    var update = {
        wx_subscribe: 1,
        wx_subscribe_time: new Date(),
        $inc: {'subscribeCount': 1},
        role: UserRole.Teacher.value()
    };

    UserService.updateAsync(user.id, update)
        .then(function(result){
            return ClazzTeacherService.createAsync({user: user.id, headUrl: user.wx_headimgurl, name: user.wx_nickname});
        })
        .then(function(ClazzTeacher){
            var replyMsg = '欢迎老师注册！';
            res.reply(replyMsg);
        })
        .catch(Error, function(err){
            logger.error(err);
        });
};

var handler = new QrHandler(true, 'TS', handle); //TS teacher subscribe handler

module.exports = handler;
