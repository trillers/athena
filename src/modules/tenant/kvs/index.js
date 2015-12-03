var u = require('../../../app/util');
var context = require('../../../context');

var Tenant = require('./Tenant');
var Platform = require('./Platform');

module.exports.tenant        = new Tenant(context);
module.exports.platform        = new Platform(context);

u.extend(context.kvs, module.exports);