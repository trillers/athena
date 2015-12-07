var TenantMemberRole = require('../../common/models/TypeRegistry').item('TenantMemberRole');
var Model = function(domainBuilder){
    var schema = domainBuilder
        .i('TenantMember')
        .withBasis()
        .withLifeFlag()
        .withCreatedOn()
        .withProperties({
            tenant:         {type: String, ref: 'Tenant', required: true}
            , nickname:     {type: String, required: true}
            , headimgurl:   {type: String}
            , role:         {type: String, enum: TenantMemberRole.valueList(), default: TenantMemberRole.TenantAdmin.value(), required: true}
            , remark:       {type: String}
            , desc:         {type: String}
        })
        .build();
    return schema.model(true);
};

module.exports = Model;
