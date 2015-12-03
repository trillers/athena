var cbUtil = require('../../../../framework/callback');

var Service = function(context){
    this.context = context;
};

Service.prototype.create = function(mediumUserJson, callback){
    var kv = this.context.kvs.wechatMediumUser;
    var WechatMediumUser = this.context.models.WechatMediumUser;
    var mediumUser = new WechatMediumUser(mediumUserJson);
    mediumUser.save(function (err, result, affected) {
        cbUtil.logCallback(
            err,
            'Fail to save wechat medium user: ' + err,
            'Succeed to save wechat medium user');

        cbUtil.handleAffected(function(err, doc){
            var obj = doc.toObject({virtuals: true});
            kv.saveById(obj, function(err, obj){
                if(callback) callback(err, obj);
            });
        }, err, result, affected);
    });

};

module.exports = Service;