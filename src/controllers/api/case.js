var caseMessageService = require('../../modules/case/services/CaseMessageService');
var caseService = require('../../modules/case/services/CaseService');

module.exports = function(router) {
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
