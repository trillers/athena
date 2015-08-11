var u = require('../../app/util');

var SchemaPlugin = function(o){
    u.extend(this, o);
    if(!this.name){
        throw new Error('"name" is requried and unique');
    }
    if(!this.prop){
        throw new Error('"prop" is requried');
    }
    if(!this.type){
        throw new Error('"type" is requried');
    }
    this.methodName = 'with' + this.name.charAt(0).toUpperCase() + this.name.slice(1);
};
SchemaPlugin.prototype = {
    /*
     *  The identifier is used in builder. make sure it is unique in all plugins.
     *  i.e. if name is createBy and the plugin is registered,
     *  then withCreatedBy method will be generated in builder.
     */
    name: null,
    prop: null, //property name of mongoose schema. i.e. _id
    type: null, //mongoose schema types. i.e. {type: String, required: true}
    register: function(builderClass){
        builderClass.plugins[this.prop] = this;
        var plugin = this;
        builderClass.prototype[this.methodName] = function(options){
            this.usePlugins[plugin.prop] = options;
            return this;
        };
    },
    use: function(schema, options){
        console.log('SchemaPlugin ' + this.name + ' is used');
    }
};

module.exports = SchemaPlugin;