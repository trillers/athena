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

var csIdToCSSetKey = function(csId){
    return 'cs:set:' + csId;
}

var csOpenIdToCSSetKey = function(csOpenId){
    return 'cs:set:' + csOpenId;
}

var getCSSKey = function(openId, csId){
    return 'cs:sess:' + openId + '/' + csId;
}

var getConQueueKey = function(){
    return 'cs:conq';
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

    loadCSSById: function(id, callback){
        var pkey = 'cs:sess:*' + id + '*';
        redis.keys(pkey, function(err, key){
            if(err) return cbUtil.handleSingleValue(callback, err, key);
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
            redis.del(key, function(err, result){
                cbUtil.logCallback(
                    err,
                    'Fail to delete customer server session by id ' + id + ': ' + err,
                    'Succeed to delete customer server session by id ' + id);

                cbUtil.handleSingleValue(callback, err, result);
            });
        });
    },

    loadCSSetByCSId: function(csId, callback){
        var key = csIdToCSSetKey(csId);
        redis.lrange(key, 0, -1, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load pc customer server  set by csId ' + csId + ': ' + err,
                'Succeed to load pc customer server  set by csId ' + csId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    pushCSSetByCSId: function(csId, callback){
        var key = csIdToCSSetKey(csId);
        redis.lpush(key, csId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to add pc customer server  set by csId: ' + csId + ': ' + err,
                'Succeed to add pc customer server  set by csId: ' + csId);
            cbUtil.handleAffected(callback, err, csId, result);
        });
    },

    popCSSetByCSId: function(csId, callback){
        var key = csIdToCSSetKey(csId);
        redis.lpop(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to pop pc customer server  set by csId ' + csId + ': ' + err,
                'Succeed to pop pc customer server  set status csId ' + csId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    remCSSetByCSId: function(csId, callback){
        var key = csIdToCSSetKey(csId);
        redis.lrem(key, 0, csId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to pop pc customer server  set by csId ' + csId + ': ' + err,
                'Succeed to pop pc customer server  set status csId ' + csId);

            cbUtil.handleAffected(callback, err, csId, result);
        });
    },

    delCSSetByCSId: function(csId, callback){
        var key = csIdToCSSetKey(csId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete pc customer server  set by csId ' + csId + ': ' + err,
                'Succeed to delete pc customer server  set by csId ' + csId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadCSSetByCSOpenId: function(csOpenId, callback){
        var key = csOpenIdToCSSetKey(csOpenId);
        redis.lrange(key, 0, -1, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load wc customer server  set by csOpenId ' + csOpenId + ': ' + err,
                'Succeed to load wc customer server  set by csOpenId ' + csOpenId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    pushCSSetByCSOpenId: function(csOpenId, callback){
        var key = csOpenIdToCSSetKey(csOpenId);
        redis.lpush(key, csOpenId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to add wc customer server  set by csOpenId: ' + csOpenId + ': ' + err,
                'Succeed to wc add customer server  set by csOpenId: ' + csOpenId);
            cbUtil.handleAffected(callback, err, csOpenId, result);
        });
    },

    popCSSetByCSOpenId: function(csOpenId, callback){
        var key = csOpenIdToCSSetKey(csOpenId);
        redis.lpop(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to pop wc customer server set by csOpenId ' + csOpenId + ': ' + err,
                'Succeed to pop wc customer server set status csOpenId ' + csOpenId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    remCSSetByCSId: function(csOpenId, callback){
        var key = csOpenIdToCSSetKey(csOpenId);
        redis.lrem(key, 0, csOpenId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to pop wc customer server  set by csOpenId ' + csOpenId + ': ' + err,
                'Succeed to pop wc customer server  set status csOpenId ' + csOpenId);

            cbUtil.handleAffected(callback, err, csOpenId, result);
        });
    },

    delCSSetByCSOpenId: function(csOpenId, callback){
        var key = csOpenIdToCSSetKey(csOpenId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete wc customer server  set by csOpenId ' + csOpenId + ': ' + err,
                'Succeed to delete wc customer server  set by csOpenId ' + csOpenId);

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
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    pushConQueue: function(con, callback){
        var key = getConQueueKey();
        redis.rpush(key, con, function(err, result){
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

            cbUtil.handleSingleValue(callback, err, result);
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
    }
};

CustomerServer = Promise.promisifyAll(CustomerServer);

module.exports = CustomerServer;