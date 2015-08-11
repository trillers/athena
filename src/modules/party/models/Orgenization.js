var mongoose = require('../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('Orgenization')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        orgCode: {type: String, require: true},
        desc: {type: String},
        name: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);