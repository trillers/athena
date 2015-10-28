define(function (require, exports, module) {
    var actions = require('../../index').actions();
    var action = actions.loadActivity;

    var onDone = function(activity){
        console.warn(activity);
    };
    action.onDone(onDone);

    var onFail = function(error){
        console.error(error.code + ' - ' + error.msg);
    };
    action.onFail(onFail);

    var onAlways = function(){
        console.log(this.action.name() + ' ' + this.id + ' is invoked!');
    };
    action.onAlways(onAlways);

    var id = '7vxYm';

    action.execute(id);

    /**
     * unbind callbacks when tag is mounted.
     */
    //this.on('unmount', function(){
    //    action.offDone(onDone);
    //    action.offFail(onFail);
    //});

    module.exports = action;
});