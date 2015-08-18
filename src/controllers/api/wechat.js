var settings = require('athena-settings');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var token = require('../../modules/wechat/common/token');

module.exports = function(router){

    //jt - get js ticket
    router.get('/jt', function* (){
        var self = this;
        var force = req.query.force && req.query.force=='true';
        token.generateGetJt(force)(function(err, jt){
            if(err){
                logger.error(err);
                self.response.status = 400;
                self.response.body = ApiReturn.i().error(err.code, err.message);
            }
            else{
                self.response.status = 200;
                self.response.body = ApiReturn.i().ok(jt);
            }
        });
    });

    //at - get access token
    router.get('/at', function* (){
        var force = req.query.force && req.query.force=='true';
        token.generateGetAt(force)(function(err, at){
            if(err){
                logger.error(err);
                self.response.status = 400;
                self.response.body = ApiReturn.i().error(err.code, err.message);
            }
            else{
                self.response.status = 200;
                self.response.body = ApiReturn.i().ok(at);
            }
        });
    });
};