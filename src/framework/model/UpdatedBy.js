var SchemaPlugin = require('./SchemaPlugin');
var context = require('../../app/context');

var plugin = new SchemaPlugin({
    name: 'updatedBy',
    prop: 'updBy',
    type: {type: String, ref: 'User', default: null},
    use: function(schema, options){
        //Add the property to schema
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);

        //Add a save method's Preprocessor for updatedBy auto-populating with current user
        schema.pre('save', function (next) {
            this.autoUpdatedBy();
            next();
        });

        /*
         * Add a instance method to ensure updatedBy:
         * get it from current context, then set and return it.
         */
        var prop = this.prop;
        schema.method('autoUpdatedBy', function (uid) {
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