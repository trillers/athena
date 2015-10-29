var util = {};

util.extend = function(obj, source) {
    for (var prop in source) {obj[prop] = source[prop];}
    return obj;
};

util.getArguments = function(args){return Array.prototype.slice.call(args, 0);};

util.remove = function(array, item) {
    var i = array.indexOf(item);
    i > -1 && array.splice(i, 1);
};

var _ids = {};

util.nextId = function(name){
    if(!_ids[name]) _ids[name] = 1;
    return _ids[name]++;
};

module.exports = util;
