var cbUtil = require('../../../../framework/callback');

var Service = function(context){
    //assert.ok(this.Tenant = context.models.Tenant, 'no Model Tenant');
    this.context = context;
};

Service.prototype.create = function(mediumJson, callback){
    var WechatMedium = this.context.models.WechatMedium;
    var medium = new WechatMedium(mediumJson);
    medium.save(function (err, result, affected) {
        //TODO: need logging
        cbUtil.handleAffected(callback, err, result, affected);
    });

};

module.exports = Service;