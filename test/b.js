var A = require('./A');

var B = module.exports = function(){
    return {
        stuff : function() {
            console.log('I got the id: ', A.getId());
        }
    };
};