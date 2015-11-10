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

    //file
    var file_router = new router();
    file_router.prefix('/api/file');
    require('./file')(file_router);
    app.use(file_router.routes());

    //cvs module
    var cvs_router = new router();
    cvs_router.prefix('/api/cvs');
    require('./cvs')(cvs_router);
    app.use(cvs_router.routes());

    //msg module
    var msg_router = new router();
    msg_router.prefix('/api/msg');
    require('./msg')(msg_router);
    app.use(msg_router.routes());

    //cs module
    var cs_router = new router();
    cs_router.prefix('/api/cs');
    require('./cs')(cs_router);
    app.use(cs_router.routes());

    //customer module
    var customer_router = new router();
    customer_router.prefix('/api/customer');
    require('./customer')(customer_router);
    app.use(customer_router.routes());

    //assistant module
    var assistant_router = new router();
    assistant_router.prefix('/api/assistant');
    require('./assistant')(assistant_router);
    app.use(assistant_router.routes());

    //system user module
    var sys_user_router = new router();
    sys_user_router.prefix('/api/sys_user');
    require('./sys_user')(sys_user_router);
    app.use(sys_user_router.routes());

}