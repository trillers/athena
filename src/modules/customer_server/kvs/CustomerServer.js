var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var _ = require('underscore');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var csIdToCSStatusKey = function(csId){
    return 'cs:st:' + csId;
}

var csOpenIdToCSStatusKey = function(csOpenId){
    return 'cs:st:' + csOpenId;
}

var getPcCSSetKey = function(){
    return 'cs:pc:set';
}

var getWcCSSetKey = function(){
    return 'cs:wc:set';
}

var getCSSKey = function(openId, csId){
    return 'cs:sess:' + openId + '/' + csId;
}

var getConQueueKey = function(){
    return 'cs:conq';
}

var getPlaceCaseKey = function(openId){
    return 'pc:' + openId;
}

var getWelcomeStatusKey = function(openId){
    return 'cs:ws:' + openId;
}

var CustomerServer = {
    loadCSStatusByCSId: function(csId, callback){
        var key = csIdToCSStatusKey(csId);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load pc customer server status by csId ' + csId + ': ' + err,
                'Succeed to load  pc customer server status by csId ' + csId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveCSStatusByCSId: function(csId, st, callback){
        var key = csIdToCSStatusKey(csId);
        redis.set(key, st, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save pc customer server status by csId: ' + csId + ': ' + err,
                'Succeed to save pc customer server status by csId: ' + csId);
            cbUtil.handleOk(callback, err, result, st);
        });
    },

    delCSStatusByCSId: function(csId, callback){
        var key = csIdToCSStatusKey(csId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete pc customer server status by csId ' + csId + ': ' + err,
                'Succeed to delete pc customer server by status csId ' + csId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    resetCSStatusTTLByCSId: function(csId, callback){
        var key = csIdToCSStatusKey(csId);
        redis.expire(key, 1800, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to reset pc customer server ttl by csId ' + csId + ': ' + err,
                'Succeed to reset pc customer server ttl by csId ' + csId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadCSStatusByCSOpenId: function(csOpenId, callback){
        var key = csOpenIdToCSStatusKey(csOpenId);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load wc customer server status by csOpenId ' + csOpenId + ': ' + err,
                'Succeed to load wc customer server status by csOpenId ' + csOpenId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveCSStatusByCSOpenId: function(csOpenId, st, callback){
        var key = csOpenIdToCSStatusKey(csOpenId);
        redis.set(key, st, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save wc customer server status by csOpenId: ' + csOpenId + ': ' + err,
                'Succeed to save wc customer server status by csOpenId: ' + csOpenId);
            cbUtil.handleOk(callback, err, result, st);
        });
    },

    delCSStatusByCSOpenId: function(csOpenId, callback){
        var key = csOpenIdToCSStatusKey(csOpenId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete wc customer server status by csOpenId ' + csOpenId + ': ' + err,
                'Succeed to delete wc customer server by status csOpenId ' + csOpenId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    resetCSStatusTTLByCSOpenId: function(csOpenId, callback){
        var key = csOpenIdToCSStatusKey(csOpenId);
        redis.expire(key, 1800, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to reset wc customer server ttl by csOpenId ' + csOpenId + ': ' + err,
                'Succeed to reset wc customer server ttl by csOpenId ' + csOpenId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadCSSById: function(id, callback){
        var pkey = 'cs:sess:*' + id + '*';
        redis.keys(pkey, function(err, key){
            if(err) return cbUtil.handleSingleValue(callback, err, key);
            if(key.length ==0) return callback(null, null);
            redis.hgetall(key, function(err, result){
                cbUtil.logCallback(
                    err,
                    'Fail to load customer server session by id ' + id + ': ' + err,
                    'Succeed to load customer server session by id ' + id);
                cbUtil.handleSingleValue(callback, err, result);
            });
        });
    },

    saveCSSById: function(openId, csId, css, callback){
        var key = getCSSKey(openId, csId);
        redis.hmset(key, css, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save customer server session by id: ' + openId + '/'+ csId + ': ' + err,
                'Succeed to save customer server session by id: ' + openId + '/'+ csId );
            cbUtil.handleOk(callback, err, result, css);
        });
    },

    delCSSById: function(id, callback){
        var pkey = 'cs:sess:*' + id + '*';
        redis.keys(pkey, function(err, key) {
            if (err) return cbUtil.handleSingleValue(callback, err, key);
            console.log('++++++++++++++++');
            console.log(key);
            if(key.length > 0){
                redis.del(key, function(err, result){
                    cbUtil.logCallback(
                        err,
                        'Fail to delete customer server session by id ' + id + ': ' + err,
                        'Succeed to delete customer server session by id ' + id);

                    cbUtil.handleSingleValue(callback, err, result);
                });
            }else{
                cbUtil.handleSingleValue(callback, err, null);
            }
        });
    },

    loadPcCSSet: function(callback){
        var key = getPcCSSetKey();
        redis.lrange(key, 0, -1, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load pc customer server  set : ' + err,
                'Succeed to load pc customer server  set ');
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    pushPcCSSet: function(csId, callback){
        var key = getPcCSSetKey();
        redis.rpush(key, csId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to add pc customer server  set : ' + csId + ': ' + err,
                'Succeed to add pc customer server  set : ' + csId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    popPcCSSet: function(callback){
        var key = getPcCSSetKey();
        redis.lpop(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to pop pc customer server  set : ' + err,
                'Succeed to pop pc customer server set  ');

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    remPcCSSet: function(csId, callback){
        var key = getPcCSSetKey();
        redis.lrem(key, 0, csId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to remove pc ' + csId+ ' from pc customer server  set : ' + err,
                'Succeed to remove ' + csId + ' from pc customer server  set  ');

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    delPcCSSet: function(callback){
        var key = getPcCSSetKey();
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete pc customer server  set : ' + err,
                'Succeed to delete pc customer server  set ');

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadWcCSSet: function(callback){
        var key = getWcCSSetKey();
        redis.lrange(key, 0, -1, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load wc customer server  set : ' + err,
                'Succeed to load wc customer server  set ');
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    pushWcCSSet: function(csOpenId, callback){
        var key = getWcCSSetKey();
        redis.rpush(key, csOpenId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to add wc customer server  set : ' + csOpenId + ': ' + err,
                'Succeed to add wc customer server  set : ' + csOpenId);
            cbUtil.handleSingleValue(callback, err, csOpenId, result);
        });
    },

    popWcCSSet: function(callback){
        var key = getWcCSSetKey();
        redis.lpop(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to pop wc customer server set : ' + err,
                'Succeed to pop wc customer server set  ');

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    remWcCSSet: function(csOpenId, callback){
        var key = getWcCSSetKey();
        redis.lrem(key, 0, csOpenId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to pop wc customer server  set ' + csOpenId + ': ' + err,
                'Succeed to pop wc customer server  set ' + csOpenId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    delWcCSSet: function(callback){
        var key = getWcCSSetKey();
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete wc customer server  set : ' + err,
                'Succeed to delete wc customer server  set ');

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadConQueue: function(callback){
        var key = getConQueueKey();
        redis.lrange(key, 0, -1, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load conversation queue : ' + err,
                'Succeed to load conversation queue ');
            if(result.length > 0){
                result = result.map(function(item){
                    return JSON.parse(item);
                });
            }
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    pushConQueue: function(con, callback){
        var key = getConQueueKey();
        redis.rpush(key, JSON.stringify(con), function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to add conversation queue : ' + err,
                'Succeed to conversation queue ');
            cbUtil.handleAffected(callback, err, con, result);
        });
    },

    popConQueue: function(callback){
        var key = getConQueueKey();
        redis.lpop(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to pop conversation queue: ' + err,
                'Succeed to pop conversation queue ' );

            cbUtil.handleSingleValue(callback, err, JSON.parse(result));
        });
    },

    delConQueue: function(callback){
        var key = getConQueueKey();
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete conversation queue : ' + err,
                'Succeed to delete conversation queue');

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadPlaceCase: function(csOpenId, callback){
        var key = getPlaceCaseKey(csOpenId);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load wc customer server place case by csId ' + csOpenId + ': ' + err,
                'Succeed to load  wc customer server place case by csId ' + csOpenId);
            cbUtil.handleSingleValue(callback, err, JSON.parse(result));
        });
    },

    savePlaceCase: function(csOpenId, pc, callback){
        var key = getPlaceCaseKey(csOpenId);
        redis.set(key, JSON.stringify(pc), function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save wc customer server place case by csId: ' + csOpenId + ': ' + err,
                'Succeed to save wc customer server place case by csId: ' + csOpenId);
            cbUtil.handleOk(callback, err, result);
        });
    },

    delPlaceCase: function(csOpenId, callback){
        var key = getPlaceCaseKey(csOpenId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete wc customer server place case by csId ' + csOpenId + ': ' + err,
                'Succeed to delete wc customer server place case csId ' + csOpenId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadWelcomeStatus: function(openId, callback){
        var key = getWelcomeStatusKey(openId);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load welcome status: ' + err,
                'Succeed to load welcome status');
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveWelcomeStatus: function(openId, st, callback){
        var key = getWelcomeStatusKey(openId);
        redis.set(key, st, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save welcome status: ' + err,
                'Succeed to save welcome status');
            cbUtil.handleOk(callback, err, result, st);
        });
    },

    delWelcomeStatus: function(openId, callback){
        var key = getWelcomeStatusKey(openId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete welcome status : ' + err,
                'Succeed to delete welcome status');

            cbUtil.handleSingleValue(callback, err, result);
        });
    }
};

CustomerServer = Promise.promisifyAll(CustomerServer);

module.exports = CustomerServer;