function test(options, callback){
    if(typeof options == 'function'){
        callback= options;
        options = undefined;
    }
    if(!!options){
        console.log(options)
    }
    callback(options);
}
test({test:1}, function(data){
    console.log(data)
})
test(function(data){
    console.log(data)
})
function Context(){}
Context.prototype.setState= function(state){
    this.state= state;
}
Context.prototype.do= function(){
    if(this.state.do){
        return this.state.do(this)
    }
    throw new Error('current state not support do')

};
Context.prototype.undo= function(){
    this.state.undo(this)
};
var state1= function(context){
    console.log(context)
    state1.context= context
    return state1
}
state1.do=function(){
    console.log('do something')
    this.context.state = state2(this.context)
};

var state2= function(context){
    state2.context= context
    return state2
}
state2.undo=function(){
    console.log('do something')
    this.context.state = state1(this.context)
};
var context = new Context();
context.setState(state1(context))
context.do()
context.do()
