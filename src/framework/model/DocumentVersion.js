var SchemaPlugin = require('./SchemaPlugin');

var plugin = new SchemaPlugin({
    name: 'documentVersion',
    prop: '_dv',
    type: {type: Number},
    use: function(schema, options){
        //Add the property to schema
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);

        //set version key (document-level) for mongoose optimistic locking mechanism
        schema.set('versionKey', this.prop);
    }
});

module.exports = plugin;