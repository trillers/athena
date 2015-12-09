var RoleMsgDispatcher = require('./common/RoleMsgDispatcher');
var dispatcher = new RoleMsgDispatcher();

require('../../platform/main/handlers/PoHandler')(dispatcher);

module.exports = dispatcher;