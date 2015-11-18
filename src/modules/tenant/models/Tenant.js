var TenantType = require('../../common/models/TypeRegistry').item('TenantType');

var Model = function(domainBuilder){
    var schema = domainBuilder
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
    return schema.model(true);
};


module.exports = Model;
