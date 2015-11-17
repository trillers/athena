var assert = require('assert');
var logger = require('../../../app/logging').logger;
var cbUtil = require('../../../framework/callback');

var context = {models: {}, services: {}};


var Service = function(context){
    assert.ok(this.redis = context.redis.main, 'no redis main client');
    assert.ok(this.Tenant = context.models.Tenant, 'no Model Tenant');
};

module.exports = context;