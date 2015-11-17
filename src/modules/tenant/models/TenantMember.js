var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var TenantMemberRole = require('../../common/models/TypeRegistry').item('TenantMemberRole');

var schema = DomainBuilder
    .i('TenantMember')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        name:           {type: String, required: true}
        , headimgurl:   {type: String}
        , role:         {type: String, enum: TenantMemberRole.valueList(), default: TenantMemberRole.TenantAdmin.value(), required: true}
        , desc:         {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
