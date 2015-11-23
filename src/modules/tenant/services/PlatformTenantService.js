var util = require('util');
var platformSettings = require('athena-settings').platform;
var cbUtil = require('../../../framework/callback');
var TenantType = require('../../common/models/TypeRegistry').item('TenantType');

var Service = function(context){
    //assert.ok(this.Tenant = context.models.Tenant, 'no Model Tenant');
    this.context = context;
};

util.inherits(Service, require('./TenantService'));

Service.prototype.createPlatform = function(callback){
    /**
     *   wechat: {
    appKey: 'wx23f1709f7727051f',
    appSecret: '977f6080e128d465b673deb79e3d31b8',
    token: 'trillers',
    encodingAESKey: '9zYRktc6N1WPyqH6hXq38tJC2CVDaLjHIkxRpihzmx3',
    siteId: 'gh_afc333104d2a',
    siteName: '错题本'

    name:           {type: String, required: true}
    , type:         {type: String, enum: TenantType.valueList(), default: TenantType.Personal.value(), required: true}
    , administrative:      {type: Boolean, default: false}
    , desc:         {type: String}
  },
     */
    var platform = {
        name: platformSettings.name,
        desc: platformSettings.desc
    };
    platform.type = TenantType.Organizational.value();
    platform.administrative = true;

    this.create(platform, function(err, platform){
        if(err) {
            if(callback) callback(err);
        }
        else{
            var id = platform.id;
            //TODO link platform tenant
            if(callback) callback(null, platform);
        }
    });
};

module.exports = Service;