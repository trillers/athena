var A = require('./A');
console.log(5555555)
var B = module.exports = function(){
    console.log(5555555)
    return {
        stuff : function() {
            console.log('I got the id: ', A.getId());
        }
    };
};