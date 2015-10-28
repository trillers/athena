var configureLocals = require('../middlewares/locals');
module.exports = function(router){
    router.use(configureLocals);
};
