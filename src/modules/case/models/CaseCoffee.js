var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('CaseCoffee')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        courierName: {type: String, require: true},     //派送员
        courierPhone: {type: String, require: true},    //派送员手机
        category: {type: String, require: true},        //摩卡？拿铁？
        remark: {type: String, require: true},          //备注，不加糖？
        store: {type: String}                           //门店
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);