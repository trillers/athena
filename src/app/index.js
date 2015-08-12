var app = require('./application');
var settings = require('athena-settings');
var logger = require('./logging').logger;
var system = require('./system');
var application = require('./application');

system.addMember('application', application);
system.startup();
system.on('up', function(){
    logger.info('system is up!!!');
});
system.on('down', function(){
    logger.info('system is down!!!');
});
