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
    var _next = function* (){
        var me = this.frankon;
        if(!me.middlewares.length) return;
        var middleware = me.middlewares.slice(this.middlewareIndex, this.middlewareIndex+1);
        this.middlewareIndex += 1;
        yield middleware[0].apply(this, [_next]);
    }
    return function* (){
        yield _next.call(this);
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
        this['frankon'] = me;
        this['middlewareIndex'] = 0;
        yield entryFn.apply(this, arguments);
    }
}
module.exports = Frankon;