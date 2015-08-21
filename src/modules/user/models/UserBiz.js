var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');

var schema = DomainBuilder
    .i('UserBiz')
    .withBasis()
    .withCreatedOn()
    .withProperties({
        user: {type: String, ref: 'User', required: true}
        , nickName: {type: String, default: '匿名'}
        , phone: {type: String}
        , commonAddress: [{
            content: {type: String, required: true},
            count: {type: Number, required: true, default: 0}
        }]
        , home: {type: String}
        , company: {type: String}
        , wx_openid: {type: String, required: true}
        //, tag: [{type: String, ref: 'Tag'}]
    })
    .build();
module.exports.schema = schema;
module.exports.model = schema.model(true);