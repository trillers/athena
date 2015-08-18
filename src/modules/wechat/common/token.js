var settings = require('athena-settings');
var wechat = require('./api');
var Promise = require('bluebird');

//Generate fn to get access token
var generateGetAt = function(force){
    var fn = null;
    if(force){
        fn = function(callback){
            wechat.api.getAccessToken(function(err, token){
                if(err){
                    if(callback) callback(err);
                }
                else{
                    if(callback) callback(null, token.accessToken);
                }
            });
        };
    }
    else{
        fn = function(callback){
            wechat.api.getLatestToken(function(err, token){
                if(err){
                    if(callback) callback(err);
                }
                else{
                    if(callback) callback(null, token.accessToken);
                }
            });
        };
    }

    return Promise.promisify(fn);
};
module.exports.generateGetAt = generateGetAt;
var getAt = generateGetAt(false);
module.exports.getAt = Promise.promisify(getAt);

//Generate fn to get js ticket
var generateGetJt = function(force){
    var fn = null;
    if(force){
        fn = function(callback){
            wechat.api.getTicket('jsapi', function(err, token){
                if(err){
                    if(callback) callback(err);
                }
                else{
                    if(callback) callback(null, token.ticket);
                }
            });
        };
    }
    else{
        fn = function(callback){
            wechat.api.getLatestTicket(function(err, token){
                if(err){
                    if(callback) callback(err);
                }
                else{
                    if(callback) callback(null, token.ticket);
                }
            });
        };
    }

    return Promise.promisify(fn);
};
module.exports.generateGetJt = generateGetJt;
var getJt = generateGetJt(false);
module.exports.getJt = Promise.promisify(getJt);


var getJc = function(params, callback){
    wechat.api.getJsConfig(params, function(err, jc){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, jc);
        }
    });
};
var getJcAsync = Promise.promisify(getJc);

module.exports.getJc = function(params, callback){
    return getJcAsync(params)
        .then(function(jc){
            if(callback) callback(null, jc);
            return jc;
        })
        .catch(Error, function(e){
            logger.error('Fail to get js config: ' + e);
            if(callback) callback(e);
        });
};