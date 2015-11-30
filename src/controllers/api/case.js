var caseMessageService = require('../../modules/case/services/CaseMessageService');
var caseService = require('../../modules/case/services/CaseService');
var wechatBotGroupService = require('../../modules/wechat-bot/services/WechatBotGroupService');
var botManager = require('../../modules/assistant/botManager');

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var nodeExcel = require('excel-export');

module.exports = function(router) {
    router.get('/exportAllMsg', function*(){
        var date = this.query.date || new Date();
        var startTime = new Date(date);
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        var endTime = new Date(date);
        endTime.setHours(23);
        endTime.setMinutes(59);
        endTime.setSeconds(59);
        var conf ={};
        conf.cols = [{
            caption:'发送人',
            type:'string',
            width:40
        },{
            caption:'内容',
            type:'string',
            width:40
        },{
            caption:'时间',
            type:'data',
            width:40
        }];
        conf.rows = [];
        var params = {
            conditions: {content: /@跟谁学3810小助手/, crtOn: {$gt: startTime, $lt: endTime}}
        }
        console.log(params);
        var msgList = yield caseMessageService.findAsync(params);
        msgList.forEach(function(item){
            conf.rows.push([item.member, item.content, new Date(item.crtOn)]);
        });
        var result = nodeExcel.execute(conf);
        this.set('Content-Type', 'application/vnd.openxmlformats');
        this.set("Content-Disposition", "attachment; filename=" + "all@msg-" + date + ".xlsx");
        this.body = new Buffer(result, 'binary');
    });
    router.get('/excel', function*(){
        var conf ={};
        conf.cols = [{
            caption:'发送人',
            type:'string',
            width:40
        },{
            caption:'内容',
            type:'string',
            width:40
        },{
            caption:'时间',
            type:'data',
            width:40
        }];
        conf.rows = [];
        var caseList = yield caseService.findAsync({});
        caseList.forEach(function(item){
            conf.rows.push([item.sender || '匿名', item.content, new Date(item.caseTime)]);
        });
        var result = nodeExcel.execute(conf);
        this.set('Content-Type', 'application/vnd.openxmlformats');
        this.set("Content-Disposition", "attachment; filename=" + "Case.xlsx");
        this.body = new Buffer(result, 'binary');
    });
    router.get('/loadCase', function*(){
        var caseList = yield caseService.findAsync({});
        this.body = caseList;
    });
    router.get('/loadCaseMsg', function*(){
        var userId = this.query.id;
        var startTime = new Date();
        startTime.setDate(startTime.getDate() - 2);
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        var params = {
            conditions:{
                from: userId,
                crtOn: {
                    $gte: startTime
                }
            },
            sort:{
                crtOn: 1
            },
            populate:[
                {
                    path: 'from',
                    select: 'nickname',
                    model: 'User'
                }
            ]
        }
        try{
            var caseMsgList = yield caseMessageService.findAsync(params);
            this.body = caseMsgList;
        }catch(err){
            console.log('case controller load case message by id err: ' + err);
        }
    });
    router.post('/add', function*(){
        var caseData = {
           sender: this.request.body.sender,
           content: this.request.body.content,
           caseTime: this.request.body.caseTime
        }
        var res = yield caseService.createAsync(caseData);
        this.body = res;
    });
    router.post('/reply', function*(){
        var groupId = this.request.body.gId;
        var msg = this.request.msg;
        var group = yield wechatBotGroupService.loadByIdAsync(groupId);
        var bot_id =  group.bucketid + ':' + group.openid
        var message = {
            ToUserName: group.name,
            FromUserName: bot_id,
            MsgType: 'text',
            Content: msg
        }

        botManager.sendText(bot_id, message);
        this.body = {success: true};
    })
}
