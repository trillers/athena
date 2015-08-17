var co = require('co');
function Frankon(){
    this.middlewares = [];
    this.ctx = {};
}
var proto = Frankon.prototype;
proto.use = function(fn){
    this.middlewares.push(fn);
};
proto.compose = function(){
    var me = this.frankon;
    var _next = function* (){
        if(!me.middlewares.length) return;
        var middleware = me.middlewares.shift();
        yield middleware.apply(this, _next);
    }
    return function* (){
        yield _next();
    }
};
proto.generateHandler = function(){
    var me = this;
    var entryFn = me.compose();
    return function* (){
        me.ctx = this;
        if(this.hasOwnProperty("frankon")){
            return yield Promise.reject(new Error('Frankon error occur'));
        }
        this["frankon"] = me;
        co(function* (){
            yield entryFn.apply(me, arguments);
        })
    }
}
module.exports = Frankon;