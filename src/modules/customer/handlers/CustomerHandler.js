module.exports = function(emitter){
    emitter.customer(function(event, context){
        var msg = context.weixin;
        console.log('this is customer message');
        console.log(msg);
    });
};