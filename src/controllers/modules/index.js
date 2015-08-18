var router = require('koa-router');

module.exports = function(app){
    //spa module
    var spa_router = new router();
    require('./spa')(spa_router);
    app.use(spa_router.routes());

    //wechat
    var wc_router = new router();
    wc_router.use('/wechat', function* (){
        console.log('test');
    })
    //app.use(require('./wechat')());
    app.use(wc_router.routes());

}