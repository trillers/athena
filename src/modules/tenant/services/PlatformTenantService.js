var cbUtil = require('../../../framework/callback');
var util = require('util');

var Service = function(context){
    //assert.ok(this.Tenant = context.models.Tenant, 'no Model Tenant');
    this.context = context;
};

util.inherits(Service, require('./TenantService'));

//Service.prototype.createPlatform = function(callback){
//    var platform = {
//
//    };
//    this.create(platform, callback);
//};

module.exports = Service;