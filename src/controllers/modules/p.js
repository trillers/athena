var path = require('path');
var views = require('co-views');
var render= views(path.join(__dirname, '../../views'), { map: { html: 'swig' }});
module.exports=function(router){
    //router.use('/validateIc', koaBody);
    router.get('/validateIc', function* (){
        this.body = yield render('user-bind');
    })
    router.post('/validateIc', function* (){
        console.log(11111)
        var data = this.request.body;
        var phone = data.phone;
        var ic = data.ic;
        this.status = 200;
    })
    router.post('/getIc', function* (){
        console.log(222222)
        this.status = 200;
    })
}