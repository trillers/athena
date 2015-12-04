var cbUtil = require('../../../../framework/callback');
var WechatMediumUserType = require('../../../common/models/TypeRegistry').item('WechatMediumUserType');


var Service = function(context){
    this.context = context;
};

//TODO
Service.prototype.createWechatSiteUser = function(wechatUserJson, callback) {
    wechatUserJson.type = WechatMediumUserType.WechatSiteUser.value();
    this.create(wechatUserJson, callback);
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