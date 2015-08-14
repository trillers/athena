var CustomerServerDispatcher = require('./common/CustomerServerDispatcher');

var dispatcher = new CustomerServerDispatcher();

dispatcher.register(require('./handlers/CustomerHandler'));
dispatcher.register(require('./handlers/CustomerServerHandler'));
dispatcher.register(require('./handlers/SystemManagerHandler'));

module.exports = dispatcher;

