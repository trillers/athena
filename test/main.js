var Promise = require('bluebird');
function test1(callback){
    console.log('123')
    callback()
}
function test2(callback){
    console.log('456')
    callback()
}
testa1 = Promise.promisify(test1)
testa2 = Promise.promisify(test2)
testa1()
    .then(function(){
        return Promise.resolve()
    })
    .then(function(){
        return testa2()
    })