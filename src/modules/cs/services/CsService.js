var Promise = require('bluebird');
var settings = require('athena-settings');
var User = require('../models/User').model;
var UserHelper = require('../models/User').helper;
var UserState = require('../../../framework/model/enums').UserState;
var UserKv = require('../kvs/User');
var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var wechat = require('../../wechat/common/api');
var cbUtil = require('../../../framework/callback');
var Service = {};

/**
 * Create a customer service user from openid
 * @param openid
 * @param callback
 */
Service.createFromOpenid = function(openid, callback){

};

/**
 * Set user role to customer service role by openid
 * @param openid
 * @param callback
 */
Service.setRoleByOpenid = function(openid, callback){

};

Service = Promise.promisifyAll(Service);
module.exports = Service;