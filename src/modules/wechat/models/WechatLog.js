var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var schema = DomainBuilder
    .i('WechatLog')
    .withBasis()
    .withCreatedOn()
    .withProperties({
        ToUserName: {type: String},
        FromUserName: {type: String},
        CreateTime: {type: Number},
        MsgType: {type: String},
        Content: {type: String},
        PicUrl: {type: String},
        MediaId: {type: String},
        Formate: {type: String},
        ThumbMediaId: {type: String},
        Location_X: {type: String},
        Location_Y: {type: String},
        Scale: {type: String},
        Label: {type: String},
        Title: {type: String},
        Description: {type: String},
        Url: {type: String},
        MsgId: {type: Number},
        Event: {type: String},
        EventKey: {type: String},
        Ticket: {type: String},
        Latitude: {type: String},
        Longitude: {type: String},
        Precision: {type: String},
        Recognition: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
