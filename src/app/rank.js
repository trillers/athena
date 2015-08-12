var SequenceGenerator = require('./sequence').sg;
var SequenceObject = require('./sequence').so;
var base62 = require('./base62');
var redisClient = require('./redis');

SequenceObject.prototype.toRank = function() {
    return this.val*100;
};

var seq = new SequenceGenerator(
    {
        dsc: {
            initialValue: 0,
            step: 1000,
            bookStep: 500
        },
        defaultKey: 'global',
        keyPrefix: 'seq:rank:',
        redisClient: redisClient
    },
    [{
        key: 'User',
        initialValue: 0,
        step: 1000,
        bookStep: 500
    },{
        key: 'TravelTarget',
        initialValue: 0,
        step: 1000,
        bookStep: 500
    }]
);
seq.setup();
setTimeout(function(){
    seq.init();
},200);

module.exports = seq;