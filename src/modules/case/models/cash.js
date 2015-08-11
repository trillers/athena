var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('ClazzBrief')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        clazz: {type: String, ref: 'Clazz', required: true},
        name: {type: String, required: true}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);