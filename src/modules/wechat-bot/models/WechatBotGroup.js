//var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('WechatBotGroup')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        bot: {type: String, ref: 'WechatBot'}
        , username: {type: String}
        , name: {type: String}
        , remark: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
