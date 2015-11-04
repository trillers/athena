//var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('WechatBot')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        bucketid: {type: String, required: true}
        , openid: {type: String, required: true}
        , loginFlag: {type: Boolean}
        , nickname: {type: String}
        , remark: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
