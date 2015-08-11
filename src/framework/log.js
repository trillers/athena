var logger = require('../app/logging').logger;
var log = {
    logCallback: function(err, errmsg, okmsg){
        if(err){
            logger.error(errmsg);
        }
        else{
            logger.debug(okmsg);
        }
    }
};

module.exports = log;