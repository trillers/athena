var RoleEmitter = require('./common/RoleEmitter');
var roleEmitter = new RoleEmitter();

require('../../platform/handlers/PoHandler')(roleEmitter);

module.exports = roleEmitter;