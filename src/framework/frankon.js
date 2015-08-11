function Frankon(){
    this.middlewares = [];
    this.context = {};
}
var proto = Frankon.prototype;
proto.use = function(fn){
    this.middlewares.push(fn);
};
proto.compose = function* (){
    var me = this;
    var _next = function* (){
        if(!me.middlewares.length) return;
        var middleware = me.middlewares.shift();
        yield middleware.apply(me, [].concat([].slice.call(arguments, 0, 2), _next));
    }
    return function(){
        yield _next([].slice(arguments, 0, 2));
    }
};
proto.generateHandler = function(){
    var me = this;
    var entryFn = yield me.compose();
    return function *(req, res, next){
        me.context.res = res;
        yield entryFn.apply(me, arguments);
    }
};
module.export = new Frankon();