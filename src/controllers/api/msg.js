var msgService = require('../../modules/message/services/MessageService');

module.exports = function(router) {
    router.get('/_:cvsId', function*(){
        var cvsId = this.params.cvsId;
        var params = {
            conditions:{
                channel: cvsId
            },
            sort:{
                crtOn: -1
            },
            populate:[
                {
                    path: 'from',
                    select: 'nickname',
                    model: 'User'
                },
                {
                    path: 'to',
                    select: 'nickname',
                    model: 'User'
                }
            ]
        }
        try{
            var msgList = yield msgService.findAsync(params);
            this.body = msgList;
        }catch(err){
            console.log('msg controller find msg by cvsId err: ' + err);
        }
    });
}
