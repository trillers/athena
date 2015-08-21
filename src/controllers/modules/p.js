var path = require('path');
var views = require('co-views');
var render= views(path.join(__dirname, '../../views'), { map: { html: 'swig' }});
module.exports=function(router){
    router.get('/userbind', function* (){
        this.body = yield render('user-bind');
    })
    router.post('/validateIc', function* (){
        var data = this.request.body;
        var phone = data.phone;
        var ic = data.ic;
        //bind user
        this.status = 200;
    })
    router.post('/getIc', function* (){
        console.log(222222)
        this.status = 200;
    })
}