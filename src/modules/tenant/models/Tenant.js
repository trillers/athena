var TenantType = require('../../common/models/TypeRegistry').item('TenantType');
var IntegrationType = require('../../common/models/TypeRegistry').item('IntegrationType');

var Model = function(domainBuilder){
    var schema = domainBuilder
        .i('Tenant')
        .withBasis()
        .withLifeFlag()
        .withCreatedOn()
        .withProperties({
            name:           {type: String, required: true}
            , type:         {type: String, enum: TenantType.valueList(), default: TenantType.Personal.value(), required: true}

            //integration type: internal: 内部租户 | external：外部租户
            , interType:    {type: String, enum: IntegrationType.valueList(), default: IntegrationType.Internal.value(), required: true}
            , interId:      {type: String, required: false} //integration external id
            , administrative:      {type: Boolean, default: false}
            , desc:         {type: String}
        })
        .build();
    return schema.model(true);
};

module.exports = Model;