var u = require('../../../app/util');
var context = require('../../../context');

var Tenant = require('./Tenant');

module.exports.tenant        = new Tenant(context);

u.extend(context.kvs, module.exports);