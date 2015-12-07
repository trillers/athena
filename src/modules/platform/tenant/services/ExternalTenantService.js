var util = require('util');
var cbUtil = require('../../../../framework/callback');
var TenantType = require('../../../common/models/TypeRegistry').item('TenantType');
var IntegrationType = require('../../../common/models/TypeRegistry').item('IntegrationType');
var TenantService = require('./../../../tenant/services/TenantService');

var Service = function(context){
    this.context = context;
};

util.inherits(Service, TenantService);

Service.prototype.loadIntegratedTenant = function(externalId, callback){
    //TODO
};

Service.prototype.createIntegratedTenant = function(externalId, callback){
    //TODO
};

module.exports = Service;