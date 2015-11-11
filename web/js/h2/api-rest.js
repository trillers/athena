var h2 = { version: 'WIP', settings: {} };

var util = require('./util');

var ApiErrorFactory = require('./error').ApiErrorFactory;

var _ajax = $ && $.ajax || require('jquery');

var _default_options = {dataType: 'json'};

/**
 * Restful API Factory
 * @param method
 * @constructor
 */
var RestApiFactory = function(options){
    this._options = util.extend({}, _default_options);
    this.options(options || {});
};

RestApiFactory.defaultOptions = _default_options;

RestApiFactory.prototype.options = function(options){
    util.extend(this._options, options);
};

var defineHtmlMethodSetter = function(p, method){
    p[method] = function(url){
        var restApi = new RestApi(this._options);
        var o = restApi.o;
        o.method = method;
        o.url = (o.baseUrl || '') + url;
        return restApi;
    };
};

defineHtmlMethodSetter(RestApiFactory.prototype, 'get');
defineHtmlMethodSetter(RestApiFactory.prototype, 'post');
defineHtmlMethodSetter(RestApiFactory.prototype, 'put');
defineHtmlMethodSetter(RestApiFactory.prototype, 'delete');

var RestApi = function(options){
    this.o = util.extend({}, options || {});
};

var registerListenerBinder = function(p, event){
    p[event] = function(listener){
        this.o[event] = listener;
        return this;
    };
};

RestApi.prototype.drive = function(action){
    this.o.action = action;
    return this;
};

registerListenerBinder(RestApi.prototype, 'done');
registerListenerBinder(RestApi.prototype, 'fail');
registerListenerBinder(RestApi.prototype, 'success');
registerListenerBinder(RestApi.prototype, 'error');
registerListenerBinder(RestApi.prototype, 'always');

RestApi.prototype.onDone = function(data, textStatus, jqXHR){
    if(data && data.errcode){
        var e = ApiErrorFactory.bizError(data.errcode, data.errmsg);
        this.o.fail(e);
    }
    else{
        if(data && typeof data.result !== 'undefined'){
            this.o.done(data.result);
        }
        else{
            this.o.done(data);
        }
    }
};

RestApi.prototype.onFail = function(jqXHR, textStatus, errorThrown){
    var e = ApiErrorFactory.ajaxError(textStatus, errorThrown);
    this.o.fail(e);
};

RestApi.prototype.send = function(data){
    var jqXHR = _ajax({
        type: this.o.method,
        url: this.o.url,
        dataType: this.o.dataType,
        data: data || null
    });

    if(this.o.action){
        var action = this.o.action;
        this.done(function(data){action.done(data);})
            .fail(function(error){action.fail(error);});
    }

    if(this.o.done || this.o.fail){
        jqXHR.done(this.onDone.bind(this));
        jqXHR.fail(this.onFail.bind(this));
    }
    else{
        this.o.success && jqXHR.done(this.o.success);
        this.o.error && jqXHR.fail(this.o.error);
    }

    this.o.always && jqXHR.always(this.o.always);

    return jqXHR;
};

h2.RestApi = RestApi;

h2.RestApiFactory = RestApiFactory;

module.exports = h2;
