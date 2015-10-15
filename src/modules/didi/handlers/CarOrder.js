module.exports = function(emitter){
    emitter.text(function(event, context){
        var msg = context.weixin;
        console.log(msg);
    });
};