var cbUtil = require('../../../framework/callback');

var Service = function(context){
    this.context = context;
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

module.exports = Service;