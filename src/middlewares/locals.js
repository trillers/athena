var settings = require('athena-settings');
var resources = require('athena-settings').resources;
//var UserMeta = require('../kvs/UserMeta');
//var typeRegistry = require('../models/TypeRegistry');
//var workflowRegistry = require('../app/workflow');
var time = require('../app/time');
var _ = require('underscore');
var env = settings.env.NODE_ENV;
var debug = env != 'production';

var __app = {
    settings: {
        api: settings.api,
        app: settings.app,
        env: settings.env
    },
    //enums: typeRegistry.dict(),
    //workflows: workflowRegistry.dict(),
    resources: resources
};
__app.settings.env.debug = debug;
__app.settings.app.url = 'http://'+__app.settings.app.domain;

var getUrl = function(ctx){
    return ctx.protocol + '://' + ctx.get('host') + ctx.originalUrl;
};

var getBaseUrl = function(ctx){
    return ctx.protocol + '://' + ctx.get('host');
};

var getServerTime = function(){
    return time.currentTime();
}

var detectBrowser = function(ctx){
    var ua = ctx.header['user-agent'], browser = {};

    if (/mobile/i.test(ua))
        browser.Mobile = true;

    if (/like Mac OS X/.test(ua)) {
        browser.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        browser.iPhone = /iPhone/.test(ua);
        browser.iPad = /iPad/.test(ua);
    }

    if (/Android/.test(ua))
        browser.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

    if (/webOS\//.test(ua))
        browser.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

    if (/(Intel|PPC) Mac OS X/.test(ua))
        browser.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

    if (/Windows NT/.test(ua))
        browser.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];

    return browser;
};

var preprocessUserMeta = function(meta){
    if(meta && meta.pa && meta.pa.likes){
        var list = meta.pa.likes;
        var len = list.length;
        var map = {};
        for(var i=0; i<len; i++){
            map[list[i]] = i+1;
        }
        meta.pa.likes = map;
    }

    if(meta && meta.pa && meta.pa.stars){
        var stars = meta.pa.stars;
        var len = stars.length;
        var maps = {};
        for(var i=0; i<len; i++){
            maps[stars[i]] = i+1;
        }
        meta.pa.stars = maps;
    }

    return meta;
};

var attachLocals = function* (next) {
    this.state.__app = __app;
    this.state.__page = {};

    var browser = detectBrowser(this);
    //var user = req.session && req.session.user;
    //var uid = user ? user.id : null;
    var uid = null;
    //user = user || {};
    this.browser = browser;
    //req.user = user;


    this.state.__page.browser = browser;
    //this.state.__page.user = user;
    this.state.__page.url = getUrl(this);
    this.state.__page.baseUrl = getBaseUrl(this);
    this.state.__page.servertime = getServerTime();
    this.state.__page.user = this.session.user;

    if(uid){
        //UserMeta.getMeta(uid, function(err, meta){
        //    if(err){
        //        //TODO:
        //        res.locals.__page.user.meta = {};
        //        req.userMeta = {};
        //    }
        //    else{
        //        var meta = preprocessUserMeta(meta);
        //        res.locals.__page.user.meta = meta;
        //        req.userMeta = meta;
        //    }
        //    next();
        //});
    }
    else{
        yield next;
    }
};

module.exports = attachLocals;