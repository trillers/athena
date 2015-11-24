var caseMessageService = require('../../modules/case/services/CaseMessageService');
var caseService = require('../../modules/case/services/CaseService');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var nodeExcel = require('excel-export');

module.exports = function(router) {
    router.get('/excel', function*(){
        var conf ={};
        conf.cols = [{
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
            conf.rows.push([item.content, new Date(item.caseTime)]);
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
           content: this.request.body.content,
           caseTime: this.request.body.caseTime
        }
        var res = yield caseService.createAsync(caseData);
        this.body = res;
    });
}
