var router = require('koa-router');

module.exports = function(app){
    //user module
    var user_router = new router();
    user_router.prefix('/api/user');
    require('./user')(user_router);
    app.use(user_router.routes());

    //wechat
    var wc_router = new router();
    wc_router.prefix('/api');
    require('./wechat')(wc_router);
    app.use(wc_router.routes());

    //qrCode
    var qr_router = new router();
    qr_router.prefix('/api/qr');
    require('./qr')(qr_router);
    app.use(qr_router.routes());

}