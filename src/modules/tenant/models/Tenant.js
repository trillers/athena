var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var TenantType = require('../../common/models/TypeRegistry').item('TenantType'); //TODO

var schema = DomainBuilder
    .i('Tenant')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        name:           {type: String, required: true}
        , type:         {type: String, enum: TenantType.valueList(), default: TenantType.Personal.value(), required: true}
        , administrative:      {type: Boolean, default: false}
        , desc:         {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
