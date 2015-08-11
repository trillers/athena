var util = {};
util.extend = function(obj, source) {
    for (var prop in source) {
        obj[prop] = source[prop];
    }
    return obj;
};
util.extendAll = function(target, source){
    for (var prop in source) {
        if(typeof source[prop]=='object'){
            if(typeof target[prop]!='object'){
                target[prop] = {};
            }
            util.extendAll(target[prop], source[prop]);
        }
        else{
            target[prop] = source[prop];

        }
    }
    return target;
};
util.clone = function(source) {
    return util.extend({},source);
};
util.defaults = function(obj, source) {
    for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
    }
    return obj;
};
util.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return typeof value === 'function' ? value.call(object) : value;
};


util.appendLine = function(target, str, parseFlag){
    str = str.replace(/%%.*%%/, parseFlag);
    target += str + "\n";
    return target;
}

//relationshipId generator(Two strings have the same length)
util.genOneToOneId = function(str1, str2) {
    return _sortStr(str1, str2);
}

function _sortStr(str1, str2) {
    for(var i = 0, len = str1.length; i<len; i++) {
        var char1 = str1.charAt(i),
            char2 = str2.charAt(i);
        if(char1 < char2) {
            return str1 + str2;
        }else if(char1 > char2){
            return str2 + str1;
        }else if(i === (len-1)){
            throw new Error('Failed to generate relationshipId One to One [error]: two objs has the same Id');
        }
    }
}

module.exports = {
    extend: util.extend,
    extendAll: util.extendAll,
    clone: util.clone,
    defaults: util.defaults,
    result: util.result,
    appendLine: util.appendLine,
    genOneToOneId: util.genOneToOneId
};