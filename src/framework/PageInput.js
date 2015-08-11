//var typeRegistry = require('./model/TypeRegistry');
var PageInput = function(){
};
PageInput.i = function(req){
    if(req){
        if(!req.pageInput){
            req.pageInput = new PageInput();
        }
        req.pageInput.putUser(req);
        return req.pageInput;
    }
    else{
        return new PageInput();
    }
};

PageInput.prototype = {
    enums: function(types){
        this.enums = types;
        //this.enums = typeRegistry.dict(types);
        return this;
    },
    put: function(name, value){
        this[name] = value;
        return this;
    },
    putUser: function(req){
        this.user = req.session.user;
        return this;
    }

};

module.exports = PageInput;