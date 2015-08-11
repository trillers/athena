var u = require('../app/util');

var ApiReturn = function(){};
ApiReturn.i = function(){
    return new ApiReturn();
};
var ApiReturnPrototype = {
    ok: function(result){
        this.status = true;
        this.result = result;
        return this;
    },
    error: function(code, msg){
        this.status = false;
        this.errcode = code;
        this.errmsg = msg;
        return this;
    },
    emptyFn: function(){}
};
u.extend(ApiReturn.prototype, ApiReturnPrototype);

module.exports = ApiReturn;
