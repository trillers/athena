var _ = require('underscore');
var mongoose = require('mongoose');
var logger = require('../../app/logging').logger;
var Schema = mongoose.Schema;

var BaseOptions = {
    //safe: {}, //TODO: it is important option which need to be specified carefully later.
    strict: true
};

var SchemaBuilder = function(name){
    this.name = name;
    this.usePlugins = {}
    this.properties = {}
    this.options = {};
};

SchemaBuilder.baseOptions = BaseOptions;
SchemaBuilder.basicPlugins = [];
SchemaBuilder.plugins = {};

SchemaBuilder.i = function(name){
    return new SchemaBuilder(name);
};
SchemaBuilder.plug = function(plugin, basicPlugin){
    plugin.register(SchemaBuilder);
    if(basicPlugin){
        SchemaBuilder.basicPlugins.push(plugin);
    }
};

SchemaBuilder.prototype.withBasis = function(){
    this.withBasicOptions();
    this.withBasicProperties();
    return this;
};

/**
 * @private
 * @returns {*}
 */
SchemaBuilder.prototype.withBasicOptions = function(){
    _.extend(this.options, SchemaBuilder.baseOptions); //Append basic options' definition
    return this;
};

/**
 * @private
 * @returns {*}
 */
SchemaBuilder.prototype.withBasicProperties = function(){
    SchemaBuilder.basicPlugins.forEach(function(plugin, index){
        this.usePlugins[plugin.prop] = null;
    }, this);
    return this;
};

SchemaBuilder.prototype.withProperties = function(props){
    _.extend(this.properties, props);
    return this;
};

SchemaBuilder.prototype.withOptions = function(options){
    _.extend(this.options, options);
    return this;
};

SchemaBuilder.prototype.build = function(){
    var schema = new Schema(this.properties, this.options);
    schema.name = this.name;
    schema.model = function(register){
        var model = null;
        if(register){
            model = mongoose.model(this.name, this);
        }
        else{
            model = mongoose.model(this.name);
        }
        return model;
    };
    for(var prop in this.usePlugins){
        if(this.properties[prop]){
            throw new Error('property ' + prop + ' is duplicatedly defined and conflicts with Plugin ' + SchemaBuilder.plugins[prop].name);
        }
        SchemaBuilder.plugins[prop].use(schema, this.usePlugins[prop]);
    }
    return schema;
};

module.exports = SchemaBuilder;