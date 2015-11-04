var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('File')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        name: {type: String},
        path: {type: String},
        ext: {type: String},
        wx_media_id: {type: String},
        size: {type: Number},
        mimeType: {type: String}
    })
    .build();
module.exports.schema = schema;
module.exports.model = schema.model(true);