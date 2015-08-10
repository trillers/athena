var staticServer = require('koa-static');
var path = require('path');
module.exports = function(app){
    app.use(staticServer(path.join(__dirname, '../../public')));
    app.use(staticServer(path.join(__dirname, '../../web')));
}
