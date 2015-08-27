var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('UserLocation')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        user: {type: String, ref: 'User', required: true},
        latitude: {type: String},
        longitude: {type: String},
        address: {type: String},
        formatted_address: {type: String}
    })
    .build();
module.exports.schema = schema;
module.exports.model = schema.model(true);

