var cbUtil = require('../../../framework/callback');

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

module.exports = Service;