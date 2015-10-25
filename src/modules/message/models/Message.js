var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
//var MsgChannelType = require('../../common/models/TypeRegistry').item('MsgChannelType');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');

var schema = DomainBuilder
    .i('Message')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        from: {type: String, required: true}, // server id or user id
        to: {type: String},  // server id or user id
        channel: {type: String, require: true}, //cvs id
        contentType: {type: String, enum: MsgContentType.valueList(), default: MsgContentType.text.value()},
        content: {type: String},  //text content
        an_media_id: {type: String}, //ahtena media id
        wx_media_id: {type: String},  //weixin media id
        recognition: {type: String}
    })
    .build();
module.exports.schema = schema;
module.exports.model = schema.model(true);

