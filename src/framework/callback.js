var logger = require('../app/logging').logger;
var callback = {
    logCallback: function(err, errmsg, okmsg){
        if(err){
            logger.error(errmsg);
        }
        else{
            logger.debug(okmsg);
        }
    },

    handleOk: function(callback, err, result, input){
        if(err){
            if(callback) callback(err);
            return;
        }

        if(result=='OK'){
            if(callback) callback(err, input);
        }
        else{
            if(callback) callback(new Error('Fail to run the async method'));
        }
    },

    handleSingleValue: function(callback, err, result){
        if(err){
            if(callback) callback(err);
            return;
        }

        if(callback) callback(null, result);
    },

    handleAffected: function(callback, err, result, affected){
        if(err){
            if(callback) callback(err);
            return;
        }
        if (affected == 1) {
            if(callback) callback(null, result);
        }
        else {
            callback(new Error('Fail to run the async method, ' + affected + ' results affected'));
        }
    }

};

module.exports = callback;