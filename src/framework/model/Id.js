var SchemaPlugin = require('./SchemaPlugin');
var idGen = require('../../app/id');

var plugin = new SchemaPlugin({
    name: 'id',
    prop: '_id',
    type: {
        type: String
    },
    use: function(schema, options){
        //Add the property to schema
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);

        //disable mongoose _id and id
        schema.set('_id', false);
        schema.set('id', false);

        //Add a virtual id property
        schema.virtual('id').get(function() {
            return this._id;
        })
        .set(function(id) {
            this._id = id;
        });

        /*
         * Get and store the Model's ID Generator by schema's name.
         * By default, schema and model have the same name
         */
        schema.idGenerator = idGen.get(schema.name);

        //Add a save method's Preprocessor for id auto-generating
        schema.pre('save', function (next) {
            this.autoId();
            next();
        });

        //Add a instance method to ensure id: generate, set and return id
        var prop = this.prop;
        schema.method('autoId', function (force) {
            if(force || !this[prop]){
                this[prop] = schema.idGenerator.next().toId();
            }
            return this[prop];
        })
    }
});

module.exports = plugin;