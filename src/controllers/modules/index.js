var router = require('koa-router');
module.exports = function(app){
    //spa module
    var spa_router = new router();
    require('./spa')(spa_router);
    app.use(spa_router.routes());

    var pages_router = new router();
    pages_router.prefix('/p');
    require('./p')(pages_router);
    app.use(pages_router.routes());

    //wechat
    app.use(require('./wechat')());
}