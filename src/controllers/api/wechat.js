var settings = require('athena-settings');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var token = require('../../modules/wechat/common/token');

module.exports = function(router){

    //jt - get js ticket
    router.get('/jt', function* (next){
        var self = this;
        var force = self.request.query.force && self.request.query.force=='true';
        try{
            var jt = yield token.generateGetJt(force)();
            self.response.status = 200;
            self.response.body = ApiReturn.i().ok(jt);
        } catch(err){
            logger.error(err);
            self.response.status = 400;
            self.response.body = ApiReturn.i().error(err.code, err.message);
        }
    });

    //at - get access token
    router.get('/at', function* (next){
        var self = this;
        var force = self.request.query.force && self.request.query.force=='true';
        try{
            var at = yield token.generateGetAt(force)();
            self.response.status = 200;
            self.response.body = ApiReturn.i().ok(at);
        } catch(err){
            logger.error(err);
            self.response.status = 400;
            self.response.body = ApiReturn.i().error(err.code, err.message);
        }
    });
};