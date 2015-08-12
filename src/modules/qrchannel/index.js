var QrHandlerDispatcher = require('./common/QrHandlerDispatcher');

var dispatcher = new QrHandlerDispatcher();

dispatcher.register(require('./handlers/SystemManagerHandler'));
dispatcher.register(require('./handlers/CustomerServerHandler'));
dispatcher.register(require('./handlers/RegularUserHandler'));

//dispatcher.setNullHandler(require('./handlers/NullHandler'));
//dispatcher.setDefaultHandler(require('./handlers/DefaultHandler'));

module.exports = dispatcher;