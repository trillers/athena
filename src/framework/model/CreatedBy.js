var SchemaPlugin = require('./SchemaPlugin');
var context = require('../../app/context');

var plugin = new SchemaPlugin({
    name: 'createdBy',
    prop: 'crtBy',
    type: {type: String, ref: 'User', default: null},
    use: function(schema, options){
        //Add the property to schema
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);

        //Add a save method's Preprocessor for createdBy auto-populating with current user
        schema.pre('save', function (next) {
            this.autoCreatedBy();
            next();
        });

        /*
         * Add a instance method to ensure createdBy:
         * get it from current context, then set and return it.
         */
        var prop = this.prop;
        schema.method('autoCreatedBy', function (uid) {
            if(uid){
                this[prop] = uid;
            }
            else if(!this[prop]){
                this[prop] = context.userId;
            }
            return this[prop];
        });
    }
});

module.exports = plugin;