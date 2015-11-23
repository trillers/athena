var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('Case')
    .withBasis()
    .withCreatedOn()
    .withProperties({
        content: {type: String},
        caseTime: {type: String}
    })
    .build();
module.exports.schema = schema;
module.exports.model = schema.model(true);

