var u = require('../../app/util');

var Enum = function(items){
    this.itemMap = {};
    for(var i=0; i<items.length; i++){
        this.itemMap[items[i].value] = {
            name: items[i].name,
            text: items[i].text
        };
        this[items[i].name] = items[i].value;
    }
};
Enum.prototype = {
    values: function(){
        var values = [];
        for(var value in this.itemMap){
            values.push(value);
        }
        return values;
    },
    text: function(v){
        return this.itemMap[v].text;
    }
};

module.exports = Enum;