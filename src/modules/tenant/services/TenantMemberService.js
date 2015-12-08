var cbUtil = require('../../../framework/callback');
var Promise = require('bluebird');

var Service = function(context){
    this.context = context;
};

Service.prototype.create = function(tenantMemberJson, callback){
    var TenantMember = this.context.models.TenantMember;
    var tenantMember = new TenantMember(tenantMemberJson);
    tenantMember.save(function (err, result, affected) {
        //TODO: need logging
        cbUtil.handleAffected(callback, err, result, affected);
    });

};

Service.prototype.createTenantAdmin = function(openid, callback){
    //TODO
}

Service.prototype = Promise.promisifyAll(Service.prototype);
module.exports = Service;