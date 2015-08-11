var mongoose = require('../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var PartyEnum = require('../../common/models/TypeRegistry').item('Party');

var schema = DomainBuilder
    .i('Party')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        type: {type: String, enum: PartyEnum.valueList(), default: PartyEnum.Person.value(), require: true},
        desc: {type: String},
        subparty: {type: String, require: true}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);