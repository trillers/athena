var errorPairs = require('./WechatErrors');

module.exports = {
    toString: function(err){
        var errmsg =
            '' + err + ', code: ' + err.code +
            ', possible reason: ' + errorPairs[''+err.code];
        return errmsg;
    }
};
