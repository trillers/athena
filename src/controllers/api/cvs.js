var cvsService = require('../../modules/conversation/services/ConversationService');
var ConversationState = require('../../modules/common/models/TypeRegistry').item('ConversationState');

module.exports = function(router){
    router.get('/snapshot', function *(){
        try {
            var startTime = new Date();
            startTime.setHours(0);
            startTime.setMinutes(0);
            startTime.setSeconds(0);
            var endTime = new Date();
            endTime.setHours(23);
            endTime.setMinutes(59);
            endTime.setSeconds(59);
            var todayCvsSumFilter = {createTime: {$gt: startTime, $lt: endTime}};
            var wipCvsSumFilter = {createTime: {$gt: startTime, $lt: endTime}, stt: ConversationState.WIP.value()};
            var fnCvsSumFilter = {createTime: {$gt: startTime, $lt: endTime}, stt: ConversationState.Finished.value()};
            var todayCvsSum = yield cvsService.getFilterDocCountAsync(todayCvsSumFilter),
                wipCvsSum = yield cvsService.getFilterDocCountAsync(wipCvsSumFilter),
                fnCvsSum = yield cvsService.getFilterDocCountAsync(fnCvsSumFilter),
                totalSum = yield cvsService.getFilterDocCountAsync({})

            var res = {
                todayCvsSum: todayCvsSum,
                wipCvsSum: wipCvsSum,
                fnCvsSum: fnCvsSum,
                totalSum: totalSum
            };

            this.body = res;
        }catch(err){
            console.error('query cvs snapshot err: ' + err);
            this.body = null;
        }
    });

    router.post('/find', function*(){
        var params = {};
        if(this.request.body.filter) {
            params = this.request.body.filter;
        }
        if(params.conditions){
            params.conditions.csId = {$ne: null};
            params.conditions.initiator = {$ne: null};
        }else {
            params.conditions = {
                csId: {$ne: null},
                initiator: {$ne: null}
            }
        }
        params.populate = [
            {
                path: 'initiator',
                select: 'nickname'
            },
            {
                path: 'csId',
                select: 'nickname'
            }
        ];
        try {
            var cvsList = yield cvsService.findAsync(params);
            this.body = cvsList;
        } catch(err){
            console.log('cvs router find err:' + err);
            this.body = [];
        }
    });
}