var settings = require('athena-settings').mongo;
var mongoose = require('mongoose');
var logger = require('./logging').logger;

var makeUrl = function(mongo){
    var authPart = settings.username + ':' + settings.password + '@';
    var auth = settings.username ? authPart : '';
    return 'mongodb://' + auth + mongo.host + ':' + mongo.port + '/' + mongo.db;
};

var url = makeUrl(settings);
var options = {};

var system = require('./system');
system.addMember('mongo', mongoose);
mongoose.connect(url, options, function(err){
    logger.info('Mongoose is connected to ' + url);
    system.memberUp(mongoose);
});
mongoose.connection.on('error', function(err){
    logger.error('Mongoose error happens:' + err);
    system.memberDown(mongoose);
});

module.exports = mongoose;

