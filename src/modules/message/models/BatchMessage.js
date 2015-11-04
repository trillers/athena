var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var BatchType = require('../../common/models/TypeRegistry').item('BatchType');

var schema = DomainBuilder
    .i('BatchMessage')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        from: {type: String, required: true}, // sbot _id
        toUsers: [{type: String}], //user id arr
        toGroups: [{type: String}], //group id arr
        contentType: {type: String, enum: MsgContentType.valueList(), default: MsgContentType.text.value()},
        content: {type: String},  //text content
        media_id: {type: String}, //media id
        batchType:{type: String, enum: BatchType.valueList(), default: BatchType.single.value()}
    })
    .build();
module.exports.schema = schema;
module.exports.model = schema.model(true);

