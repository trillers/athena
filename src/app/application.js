var koa = require('koa');
var app = module.exports = koa();
var views = require('co-views');
var logging = require('./logging');
var logger = require('./logging').logger;
var path = require('path');
var render= views(path.join(__dirname, '../views'), { map: { html: 'swig' }});
var settings = require('athena-settings');
var koaBody = require('koa-body');
app.env = 'development' || settings.env.NODE_ENV;
//app.enable('trust proxy'); //TODO: configure it by settings
//app.locals(settings.resources);//TODO: configure it later
app['port'] =  process.env.PORT || settings.env.PORT;//TODO: configure it by settings
app['bindip'] =  process.env.BINDIP || settings.env.BINDIP;

var http = require('http');
var env = app.env;

var system = require('./system');
system.addMember('application', app);

//var server = require('./http-server')(app);

app.use(logging.generatorFunc);
app.use(koaBody({formidable:{uploadDir: __dirname}}));
//router
require('../routes')(app);
//404
app.use(function *pageNotFound(next) {
    this.response.body = yield render('404');
});

//error
app.on('error', function(err){
    console.log(err);
});

app.listen(app.port, app.bindip, function(){
    logger.info('The server is binding on '+ app.bindip +' and listening on port ' + app.port + ' in ' + env );
    system.memberUp(app);
});
