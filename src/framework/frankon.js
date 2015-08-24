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
        console.log("enter frankon next--------------")
        console.log(this);
        var me = this.frankon;
        if(!me.middlewares.length) return;
        var middleware = me.middlewares.shift();
        yield middleware.apply(this, [_next]);
    }
    return function* (){
        console.log("enter frankon entry--------------")
        yield _next.call(this.frankon);
    }
};
proto.generateHandler = function(){
    var me = this;
    var entryFn = me.compose();
    return function* (){
        console.log("enter frankon generator--------------")
        console.log(this);
        //me.ctx = this;
        if(this.hasOwnProperty("frankon")){
            return yield Promise.reject(new Error('Frankon error occur'));
        }
        this["frankon"] = me;
        yield entryFn.apply(me, arguments);
    }
}
module.exports = Frankon;