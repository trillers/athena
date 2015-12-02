var cbUtil = require('../../../../framework/callback');

var Service = function(context){
    //assert.ok(this.Tenant = context.models.Tenant, 'no Model Tenant');
    this.context = context;
};

Service.prototype.create = function(mediumJson, callback){
    var kv = this.context.kvs.wechatMedium;
    var WechatMedium = this.context.models.WechatMedium;
    var medium = new WechatMedium(mediumJson);
    medium.save(function (err, result, affected) {
        cbUtil.logCallback(
            err,
            'Fail to save wechat medium: ' + err,
            'Succeed to save wechat medium');

        cbUtil.handleAffected(function(err, doc){
            var obj = doc.toObject({virtuals: true});
            kv.saveById(obj, function(err, obj){
                if(callback) callback(err, obj);
            });
        }, err, result, affected);
    });

};

module.exports = Service;