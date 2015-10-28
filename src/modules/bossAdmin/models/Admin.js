var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('Admin')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        username: {type: String, require: true}
        ,password: {type: String, require: true}
    })
    .build();


module.exports.schema = schema;
module.exports.model = schema.model(true);