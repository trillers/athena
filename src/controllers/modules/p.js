var path = require('path');
var views = require('co-views');
var render= views(path.join(__dirname, '../../views'), { map: { html: 'swig' }});

module.exports=function(router){
    router.get('/validateIc', function* (){
        console.log('------------------')
        this.body = yield render('user-bind');
    })
    router.post('/validateIc', function* (){
        var data = this.query;
        var phone = data.phone;
        var ic = data.ic;
        console.log(phone);
    })
}