define(function (require, exports, module) {
    var actions = require('../../index').actions();
    var action = actions.likeActivity;

    action.onDone(function(result){
        console.warn(result);
    });

    action.onFail(function(error){
        console.error(error.code + ' - ' + error.msg);
    });

    var id = '7vxYm';

    action.execute(id);

    module.exports = action;
});