var router = require('koa-router');

module.exports = function(app){
    //spa module
    var spa_router = new router();
    require('./spa')(spa_router);
    console.log(spa_router);
    console.log(spa_router.routes());
    app.use(spa_router.routes());

    //wechat
    var wechat = require('./wechat')();
    console.log(wechat.routes());
    app.use(wechat.routes());
}