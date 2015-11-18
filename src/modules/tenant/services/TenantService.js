//var assert = require('assert');
//var logger = require('../../../app/logging').logger;
var cbUtil = require('../../../framework/callback');

var Service = function(context){
    //assert.ok(this.redis = context.redis.main, 'no redis main client');
    //assert.ok(this.Tenant = context.models.Tenant, 'no Model Tenant');
    this.context = context;
};

Service.prototype.create = function(tenantJson, callback){
    var Tenant = this.context.models.Tenant;
    var tenant = new Tenant(tenantJson);
    tenant.save(function (err, result, affected) {
        //TODO: need logging
        cbUtil.handleAffected(callback, err, result, affected);
    });

};

module.exports = Service;