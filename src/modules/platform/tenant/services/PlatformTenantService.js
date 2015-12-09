var util = require('util');
var platformSettings = require('athena-settings').platform;
var cbUtil = require('../../../../framework/callback');
var TenantType = require('../../../common/models/TypeRegistry').item('TenantType');
var TenantService = require('./../../../tenant/services/TenantService');
var Promise = require('bluebird');

var Service = function(context){
    this.context = context;
};

util.inherits(Service, TenantService);

Service.prototype.ensurePlatform = function(callback){
    var logger = this.context.logger;
    var me = this;
    this.loadPlatform(function(err, platform){
        if(err){
            logger.error('Fail to ensure platform: ' + err);
            if(callback) callback(err);
            return;
        }

        if(platform){
            if(callback) callback(null, platform);
        }
        else{
            logger.warn('No platform data to load, so create it now.');
            me.createPlatform(callback);
        }
    });
};

Service.prototype.loadPlatform = function(callback){
    var logger = this.context.logger;
    var platformKv = this.context.kvs.platform;

    platformKv.getPlatformId(function(err, result){
        if(err){
            logger.error('Fail to load platform: ' + err);
            if(callback) callback(err);
            return;
        }

        if(result){
            logger.debug('Succeed to load platform');
            platformKv.loadById(result, callback);
        }
        else{
            if(callback) callback();
        }
    });
};

Service.prototype.createPlatform = function(callback){
    var logger = this.context.logger;
    var platformKv = this.context.kvs.platform;
    var platform = {
        name: platformSettings.name,
        desc: platformSettings.desc
    };
    platform.type = TenantType.Organizational.value();
    platform.administrative = true;

    this.create(platform, function(err, platform){
        if(err) {
            logger.info('Fail to create platform: ' + err);
            if(callback) callback(err);
        }
        else{
            platformKv.setPlatformId(platform.id, function(err){
                if(err) {
                    logger.info('Fail to create platform: ' + err);
                    if(callback) callback(err);
                }
                else{
                    logger.info('Succeed to create platform');
                    if(callback) callback(null, platform);
                }
            });
        }
    });
};

module.exports = Service;