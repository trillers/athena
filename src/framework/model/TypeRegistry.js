var TypeData = function(name, value, title){
    this.name = name;
    this.value = value;
    this.title = title;
    this.nameMap = {};
    this.valueMap = {};
    this.nvMap = {};
    this.vnMap = {};
    this.vtMap = {};
    this.nvtList = [];
    this.children = [];
    this.parent = null;
    this.data = null;
};
TypeData.prototype = {

};

var Type = function(name, value, title){
    this._data = new TypeData(name, value, title);
};
Type.prototype = {
    name: function(){return this._data.name},
    value: function(){return this._data.value},
    title: function(){return this._data.title},
    names: function(name){
        if(name){
            return this._data.nvMap[name];
        }
        else{
            return this._data.nvMap;
        }
    },
    valueNames: function(value){
        if(value){
            return this._data.vnMap[value];
        }
        else{
            return this._data.vnMap;
        }
    },
    values: function(value){
        if(value){
            return this._data.vtMap[value];
        }
        else{
            return this._data.vtMap;
        }
    },
    valueList: function(){
        var list = [];
        for(var k in this._data.vtMap){
            list.push(k);
        }
        return list;
    },
    list: function(){
        return this._data.nvtList;
    },
    dict: function(){
        if(!this._data.data){
            this._data.data = {
                name: this._data.name,
                value: this._data.value,
                title: this._data.title,
                names: this._data.nvMap,
                values: this._data.vtMap,
                list: this._data.nvtList
            };
        }
        return this._data.data;
    },
    item: function(name, value, title){
        var item = this._data.nameMap[name];
        if(name && value && title){
            if(!item){
                item = new Type(name, value, title);
            }
            else{
                throw new Error('Duplicated enum type: ' + JSON.stringify(item));
            }
            item._data.parent = this;
            this._data.children.push(item);
            this._data.nameMap[name] = item;
            this._data.valueMap[value] = item;

            this._data.nvMap[name] = value;
            this._data.vnMap[value] = name; //added lately
            this._data.vtMap[value] = title;
            this._data.nvtList.push({name: name, value: value, title: title});
            this[name] = item;
        }
        return item;
    },
    addChild: function (name, value, title){
        this.item(name, value, title);
        return this;
    },
    up: function (){
        return this._data.parent;
    }
};

var TypeRegistry = function(){
    Type.apply(this, arguments);
};
TypeRegistry.prototype.item = Type.prototype.item;
TypeRegistry.prototype.dict = function(inList){
    var map = {};
    var nameMap = this._data.nameMap;
    if(!inList){
        for(var name in nameMap){
            map[name] = nameMap[name].dict();
        }
    }
    else{
        var len = inList.length;
        for(var i=0; i<len; i++){
            var name = inList[i];
            map[name] = nameMap[name].dict();
        }
    }
    return map;
};

module.exports = TypeRegistry;