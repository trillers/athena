define(function (require, exports, module) {
    var actions = require('../../index').actions();
    var action = actions.filterActivities;

    action.onDone(function(activities){
        console.warn(activities);
    });

    action.onFail(function(error){
        console.error(error.code + ' - ' + error.msg);
    });

    action.onAlways(function(){
        console.log(this.action.name() + ' ' + this.id + ' is invoked!');
    });

    var filter = {
        sort: {'startTime':1},
        page: {
            size: 10,
            no: 1
        },
        conditions: {
            privateFlag: false
        }
    };

    action.execute(filter);

    module.exports = action;
});