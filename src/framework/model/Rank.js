var SchemaPlugin = require('./SchemaPlugin');
var rankGen = require('../../app/rank');

var plugin = new SchemaPlugin({
    name: 'rank',
    prop: 'rank',
    type: {
        type: Number
    },
    use: function(schema, options){
        //Add the property to schema
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);

        /*
         * Get and store the Model's Rank Generator by schema's name.
         * By default, schema and model have the same name
         */
        schema.rankGenerator = rankGen.get(schema.name);

        //Add a save method's Preprocessor for rank auto-generating
        schema.pre('save', function (next) {
            this.autoRank();
            next();
        });

        //Add a instance method to ensure rank: generate, set and return rank
        var prop = this.prop;
        schema.method('autoRank', function () {
            if(!this[prop]){
                if(this[prop]!==0){
                    this[prop] = schema.rankGenerator.next().toRank();
                }
            }
            return this[prop];
        })
    }
});

module.exports = plugin;