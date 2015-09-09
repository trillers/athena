module.exports = function(emitter){
    emitter.admin(function(event, context){
        var msg = context.weixin;
        console.log('this is admin message');
        console.log(msg);
    });
};