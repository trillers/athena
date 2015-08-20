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
        from: {type: String, ref: 'User', required: true},
        to: {type: String, ref: 'User'},
        channel: {type: String, require: true},
        contentType: {type: String,enum: MsgContentType.valueList(), default:  MsgContentType.text.value()},
        content: {type: String}  //mediaId
    })
    .build();
module.exports.schema = schema;
module.exports.model = schema.model(true);

