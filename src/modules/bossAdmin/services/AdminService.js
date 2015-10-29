var Admin = require('../models/Admin').model;
var Promise = require('bluebird');
var Service = {}

Service.findOne = function(con, callback){
    Admin.findOne(con, {}, {lean: true}, function(err, doc){
        if(err){
            if(callback){
                callback(err, null);
            }
            return;
        }
        if(callback){
            callback(null, doc);
        }
        return;
    })
}


Service = Promise.promisifyAll(Service);

module.exports = Service;