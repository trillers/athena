var id,
    bInstance;

var A = module.exports = {
    init : function(val) {
        id = val;
        bInstance = new require('./B')();
        return this;
    },

    doStuff : function() {
        bInstance.stuff();
        return this;
    },

    getId : function() {
        return id;
    }
};

