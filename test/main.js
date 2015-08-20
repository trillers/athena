var co=require('co')
function* test1(){
    setTimeout(function(){
        console.log(1231)
    }, 2000)

    return true === false
}
co(function* (){
    return yield test1();
})