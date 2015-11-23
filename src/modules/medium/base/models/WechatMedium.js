var WechatMediumType = require('../../../common/models/TypeRegistry').item('WechatMediumType');

var Model = function(domainBuilder){
    var schema = DomainBuilder
        .i('WechatMedium')
        .withBasis()
        .withLifeFlag()
        .withCreatedOn()
        .withProperties({
            tenant:       {type: String, ref: 'Tenant', required: true}
            , type:         {type: String, enum: WechatMediumType.valueList(), default: WechatMediumType.WechatSite.value(), required: true}
            , originalId: {type: String} //原始微信号ID，
            , customId:   {type: String} //自定义ID
            , name:           {type: String, required: true}
            , headimgurl:   {type: String}
            , qrcodeurl:   {type: String} //服务号或者助手号的微信二维码

            , appId:   {type: String}   //as openid when it is wechat bot
            , appSecret:   {type: String}
        })
        .build();
    return schema.model(true);
};

/**
 * 服务号：
 id
 原始ID
 自定义ID
 名称
 appId
 appSecret

 id
 原始ID
 自定义ID
 名称/昵称
 botId
 qrCodeUrl

 */
