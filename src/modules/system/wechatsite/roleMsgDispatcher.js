var RoleMsgDispatcher = require('./common/RoleMsgDispatcher');
var dispatcher = new RoleMsgDispatcher();

require('../../platform/handlers/PoHandler')(dispatcher);

module.exports = dispatcher;