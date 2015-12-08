var Promise = require('bluebird');
var u = require('../../../../app/util');
var context = require('../../../../context');

var OrgService = require('./OrgService');

module.exports.platformService = Promise.promisifyAll(new OrgService(context));

u.extend(context.services, module.exports);