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
        var middleware = me.middlewares.shift();
        yield middleware.apply(this, [_next]);
    };
    return function* () {
        yield _next();
    };
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
        yield entryFn.apply(me, arguments);
    }
};
var frankon = new Frankon();
frankon.use(function* (next){
    console.log("middleware1------begin");
    yield function* (){console.log("2131")};
    yield next;
    console.log("middleware1------back")
});
frankon.use(function* (next){
    console.log("middleware2------begin")
});
co(function* (){
    yield frankon.generateHandler()();
})
module.exports = Frankon;