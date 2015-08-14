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

var openIdToCSSKey = function(openId){
    return 'cs:sess:' + openId;
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

    loadCSSByOpenId: function(openId, callback){
        var pkey = 'cs:sess:*' + openId + '*';
        redis.keys(pkey, function(err, key){
            if(err) return cbUtil.handleSingleValue(callback, err, key);
            redis.hgetall(key, function(err, result){
                cbUtil.logCallback(
                    err,
                    'Fail to load customer server session by openId ' + openId + ': ' + err,
                    'Succeed to load customer server session by openId ' + openId);
                cbUtil.handleSingleValue(callback, err, result);
            });
        });
    },

    saveCSSByOpenId: function(openId, css, callback){
        var key = openIdToCSSKey(openId);
        redis.hmset(key, css, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save customer server session by openId: ' + openId + ': ' + err,
                'Succeed to save customer server session by openId: ' + openId);
            cbUtil.handleOk(callback, err, result, css);
        });
    },

    delCSSByOpenId: function(openId, callback){
        var key = openIdToCSSKey(openId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete customer server session by openId ' + openId + ': ' + err,
                'Succeed to delete customer server session by openId ' + openId);

            cbUtil.handleSingleValue(callback, err, result);
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

    renameKey: function(key, newKey, callback){
        redis.rename(key, newKey, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to rename key: ' + key + ': ' + err,
                'Succeed to rename key: ' + key + 'to: ' + newKey);

            cbUtil.handleOk(callback, err, result, newKey);
        });
    }

};

CustomerServer = Promise.promisifyAll(CustomerServer);

module.exports = CustomerServer;