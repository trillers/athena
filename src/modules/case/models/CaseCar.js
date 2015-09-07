var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('CaseCar')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        case: {type: String, ref: 'Case', require: true},            //关联caseId
        origin: {type: String, require: true},         //出发地
        destination: {type: String, require: true},    //目的地
        driverName: {type: String},     //司机姓名
        evaluation: {type: String},                    //司机评分
        driverPhone: {type: String},    //司机手机
        carLicensePlate: {type: String},//车牌照
        carModel: {type: String},       //车型
        carType: {type: String},                        //用车类型
        mileage: {type: Number},                        //里程数
        estimatedCost: {type: Number},   //预估费用
        useTime: {type: String, require: true}               //用车时间
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);