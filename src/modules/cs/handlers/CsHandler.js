module.exports = function(emitter){
    emitter.cs(function(event, context){
        var msg = context.weixin;
        console.log('this is cs message');
        console.log(msg);
    });
};