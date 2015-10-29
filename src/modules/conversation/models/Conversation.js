var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var ConversationState = require('../../common/models/TypeRegistry').item('ConversationState');

var schema = DomainBuilder
    .i('Conversation')
    .withBasis()
    .withProperties({
        stt: {type: String, enum: ConversationState.valueList(), default: ConversationState.Started.value(), required: true}
        , initiator: {type: String, ref: 'User', required: true}
        , csId: {type: String}
        , cases: [{type: String, ref: 'Case'}]
        , createTime: {type: Date, required: true}
        , takenTime: {type: Date}
        , closeTime: {type: Date}
        , terminalType: {type: String}
        , botId: {type:String}
    })
    .build();


module.exports.schema = schema;
module.exports.model = schema.model(true);