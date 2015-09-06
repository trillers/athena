var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var _ = require('underscore');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var getCaseStatusKey = function(caseNo, phone){
    return 'case:st:' + caseNo + '/' + phone;
}

var CaseServer = {
    loadCaseStatus: function(caseNo, phone, callback){
        var key = getCaseStatusKey(caseNo, phone);
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load case status by caseNo: ' + caseNo + ' phone: ' + phone + ' err:' + err,
                'Succeed to load case status by caseNo: ' + caseNo + ' phone: ' + phone);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveCaseStatus: function(caseNo, phone, st, callback){
        var key = getCaseStatusKey(caseNo, phone);
        redis.hmset(key, st, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save case status by caseNo: ' + caseNo + ' phone: ' + phone + ' err:' + err,
                'Succeed to save case status by caseNo: ' + caseNo + ' phone: ' + phone);
            cbUtil.handleOk(callback, err, result, st);
        });
    },

    delCaseStatus: function(caseNo, phone, callback){
        var key = getCaseStatusKey(caseNo, phone);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to del case status by caseNo: ' + caseNo + ' phone: ' + phone + ' err:' + err,
                'Succeed to del case status by caseNo: ' + caseNo + ' phone: ' + phone);

            cbUtil.handleSingleValue(callback, err, result);
        });
    }
};

CaseServer = Promise.promisifyAll(CaseServer);

module.exports = CaseServer;