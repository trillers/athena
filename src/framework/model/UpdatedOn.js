var SchemaPlugin = require('./SchemaPlugin');
var timeGenerator = require('../../app/time');
var plugin = new SchemaPlugin({
    name: 'updatedOn',
    prop: 'updOn',
    type: {
        type: Date
    },
    use: function(schema, options){
        //Add the property to schema
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);

        //Add a save method's Preprocessor for updatedOn auto-generating
        schema.pre('save', function (next) {
            this.autoUpdatedOn();
            next();
        });

        //Add a instance method to ensure updatedOn: generate, set and return it
        var prop = this.prop;
        schema.method('autoUpdatedOn', function (time) {
            if(time){
                this[prop] = time;
            }
            else {
                this[prop] = timeGenerator.currentTime();
            }
            return this[prop];
        });
    }
});

module.exports = plugin;