var router = require('koa-route');
module.exports = function(app){
    app.use(router.get('/heartbeat', function *(){
        this.status = 200;
    }));
};