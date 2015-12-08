var cbUtil = require('../../../framework/callback');
var TenantType = require('../../common/models/TypeRegistry').item('TenantType');
var Promise = require('bluebird');
var co = require('co');

var Service = function(context){
    this.context = context;
};

Service.prototype.registerTenant = function(openid, callback){
    co(function* (){
        try {
            var tenantMemberService = this.context.services.tenantMemberService;
            var tenantAdmin = yield tenantMemberService.createTenantAdminAsync(openid);
            var tenantJson = {
                name: tenantAdmin.nickname,
                type: TenantType.Personal.value(),
                administrative: false
            }
            var tenant = yield this.createAsync(tenantJson);
            cbUtil.handleSingleValue(callback, null, tenant);
            console.log('success register tenant by openid: ' + openid);
        }catch(e){
            console.error('registerTenant err: ' + e);
            cbUtil.handleSingleValue(callback, e, null);
        }
    });
};

Service.prototype.create = function(tenantJson, callback){
    var tenantKv = this.context.kvs.tenant;
    var Tenant = this.context.models.Tenant;
    var tenant = new Tenant(tenantJson);

    tenant.save(function (err, result, affected) {
        cbUtil.logCallback(
            err,
            'Fail to save tenant: ' + err,
            'Succeed to save tenant');

        cbUtil.handleAffected(function(err, doc){
            var obj = doc.toObject({virtuals: true});
            tenantKv.saveById(obj, function(err, obj){
                if(callback) callback(err, obj);
            });
        }, err, result, affected);
    });
};

Service.prototype = Promise.promisifyAll(Service.prototype);

module.exports = Service;