var SchemaPlugin = require('./SchemaPlugin');
var lifeFlagEnum = require('./enums').LifeFlag;

var plugin = new SchemaPlugin({
    name: 'LifeFlag',
    prop: 'lFlg',
    type: {type: String, enum: lifeFlagEnum.values(), required: false},
    use: function(schema, options){
        //Add the property to schema
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);

        //Add a save method's Preprocessor for LifeFlag auto-populating
        var prop = this.prop;
        schema.pre('save', function (next) {
            if(!this[prop]){
                this[prop] = lifeFlagEnum.Active;
            }
            next();
        });
    }
});

module.exports = plugin;