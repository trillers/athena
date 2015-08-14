var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var ConversationState = require('../../common/models/TypeRegistry').item('ConversationState');

var schema = DomainBuilder
    .i('Conversation')
    .withBasis()
    .withProperties({
        stt: {type: String, enum: ConversationState.values(), required: true}
        , initiator: {type: String, ref: 'UserBiz', required: true}
        , expire: {type: Date, required: true}
        , case: [{type: String, ref: 'Case'}]
        , createTime: {type: Date, required: true}
        , closeTime: {type: Date, required: true}
    })
    .build();


module.exports.schema = schema;
module.exports.model = schema.model(true);