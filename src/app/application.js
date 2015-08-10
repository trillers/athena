var koa = require('koa');
var app = module.exports = koa();
var views = require('co-views');
var logging = require('./logging');
var path = require('path');


var render= views(path.join(__dirname, '../views'), { map: { html: 'swig' }});

app.use(logging.generatorFunc);
//router
require('../routes')(app);

//404
app.use(function *pageNotFound(next) {
    this.response.body = yield render('404');
});

//error
app.on('error', function(err){
    console.log(err);
})

app.listen(3000, function(){
    console.log('app listen on port: 3000');
});