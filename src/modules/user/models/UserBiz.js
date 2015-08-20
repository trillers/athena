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
        , role: {type: String, enum: UserRole.valueList(), default: UserRole.RegularUser.value()}
        //, tag: [{type: String, ref: 'Tag'}]
    })
    .build();
schema.static('incAddress', function(id, callback){
    //this.findByIdAndUpdate()
})
var metaAction = function (prop, incOp) {
    var metaProp = 'meta.'+prop;
    var update = { $inc: {}};
    update.$inc[metaProp] = incOp ? 1 : -1;
    return function (thingId, uid, callback){
        this.findByIdAndUpdate(//TODO: update it directly use update operation
            thingId,
            update,
            {select:[metaProp]},
            function(err, thing){
                if(err){
                    logger.error(err);
                    callback(err);
                    return;
                }
                logger.debug(thing);
                if(thing){
                    thing.meta = thing.meta || {};
                    callback(null, thing.meta[prop]);
                }
                else{
                    callback(null, 0);
                }
            }
        );
    }
}
module.exports.schema = schema;
module.exports.model = schema.model(true);