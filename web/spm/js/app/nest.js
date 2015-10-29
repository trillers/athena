/**
 * nest is library to help u to build a mvp pattern spa
 */
var riot = require('seedriot');
var $ = require('jquery');
var util = require('./util');
var welcomediv = document.getElementById('welcome_pag');
var _default_model = {
    name: 'thing',
    fetched: false,
    idAttribute: '_id',
    url: '/thing/'

};

var modelize = function(obj, options){
    /*
     * make it observable
     */
    riot.observable(obj);

    /*
     * add model behaviors
     */
    obj._m = util.extend({}, _default_model);//copy defaults
    obj._m = util.extend(obj._m, options);//set options

    var _m = obj._m;
    obj.fetched = function(v){
        return typeof v === 'undefined' ? _m.fetched : _m.fetched = v;
    };

    obj.has = function(attr) {
        return this.get(attr) != null;
    },
    obj.isNew = function() {
        return !this.has(_m.idAttribute);
    };
    obj.toObject = function() {
        var obj = {};
        for(var n in this){
            if(typeof this[n] != 'function'){
                obj[n] = this[n];
            }
        }
        return obj;
    };
    obj.fetch = function(id, o){
        if(typeof o == 'undefined'){
            if(typeof id == 'object'){
                o = id;
                id = null;
            }
        }

        var _o = _m;
        o && (_o = util.extend({}, _m)) && util.extend(_o, o);
        id || (id = this[_m.idAttribute]);

        if(!id){
            console.error('fail to fetch: no id');
            return false;
        }

        var apiUrl = _o.url + '_' +id;
        var jqxhr = $.ajax({
            type:  _o.method || 'GET',
            url:   apiUrl
        });

        jqxhr
            .done(function(data, textStatus, jqXHR ){
                if(data.status){
                    obj.trigger('fetch', data.result, o);
                }
                else{
                    obj.trigger('fetch-error', data, o);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                obj.trigger('error', errorThrown, o);
            })
            .always(function(){
                //none
            });
        return jqxhr;
    };

    obj.append = function(id, o){
        if(typeof o == 'undefined'){
            if(typeof id == 'object'){
                o = id;
                id = null;
            }
        }

        var _o = _m;
        o && (_o = util.extend({}, _m)) && util.extend(_o, o);
        id || (id = this[_m.idAttribute]);

        if(!id){
            console.error('fail to append: no id');
            return false;
        }

        var apiUrl = _o.url + '_' +id;
        var jqxhr = $.ajax({
            type:  _o.method || 'GET',
            url:   apiUrl
        });

        jqxhr
            .done(function(data, textStatus, jqXHR ){
                if(data.status){
                    obj.trigger('append', data.result, o);
                }
                else{
                    obj.trigger('append-error', data, o);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                obj.trigger('error', errorThrown, o);
            })
            .always(function(){
                //none
            });
        return jqxhr;
    };

    var getQueryString = function(query){
        var params = [];
        for(var name in query){
            params.push(name + '=' + query[name]);
        }
        return params.join('&');
    };
    obj.save = function(attributes, o){
        var _o = _m;
        o && (_o = util.extend({}, _m)) && util.extend(_o, o);
        var method = this.isNew() ? 'POST' : 'PUT';
        var apiUrl = this.isNew() ? _o.url : _o.url + "_" + this[_m.idAttribute];
        var data = this.toObject();
        var queryString = getQueryString(data.query||{});
        queryString!='' && (apiUrl+='?'+queryString);
        var jqxhr = $.ajax({
            type: method,
            url:   apiUrl,
            data: data
        });

        jqxhr
            .done(function(data, textStatus, jqXHR ){
                if(data.status){
                    obj.fetched(true);
                    obj.trigger('save', data.result, o);
                }
                else{
                    obj.trigger('save-error', data, o);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown ){
                obj.trigger('error', errorThrown, o);
            })
            .always(function(){
                //none
            });
        return jqxhr;
    };

    obj.get = function(name){
        return this[name];
    };

    obj.set = function(name, value, o){
        if(name == 'myobj' && typeof value=="object"){
            util.extend(this,value);
        }
        else if(name == 'randomNotePic' && typeof value=="object"){
            util.extend(this,value);
        }
        else if(value=="object"){
            this[name] = value;
        }
        else{
            var oldValue = this[name];
            this[name] = value;
            if(o && o.silent){

            }
            else{
                this.trigger('change:' + name, this, value, oldValue);
                this.trigger('change', this);
            }
        }
    };
    return obj;
};


var _default_collection = {
    name: 'collection',
    url: '/thing/filter'
};

var collectize = function(col, options){
    /*
     * make it observable
     */
    riot.observable(col);

    /*
     * add model behaviors
     */
    col._m = util.extend({}, _default_collection);//copy defaults
    col._m = util.extend(col._m, options);//set options

    var _m = col._m;

    col.fetched = function(v){
        return typeof v === 'undefined' ? _m.fetched : _m.fetched = v;
    };

    col.fetch = function(o){
        var _o = _m;
        o && (_o = util.extend({}, _m)) && util.extend(_o, o);

        var filter = _m.filter || {};
        var apiUrl = _o.url;
        var jqxhr = $.ajax({
            type:  _o.method || 'POST',
            url:   apiUrl,
            data:  {filter: filter}
        });

        jqxhr
            .done(function(data, textStatus, jqXHR ){
                if(data.status){
                    col.items = data.result;
                    col.fetched(true);
                    col.trigger('fetch', data.result, o);
                }
                else{
                    col.trigger('fetch-error', data, o);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                col.trigger('error', errorThrown, o);
            })
            .always(function(){
                //none
            });
        return jqxhr;
    };

    col.append = function(o){
        var _o = _m;
        o && (_o = util.extend({}, _m)) && util.extend(_o, o);

        var filter = _m.filter || {};
        var apiUrl = _o.url;
        var jqxhr = $.ajax({
            type:  _o.method || 'POST',
            url:   apiUrl,
            data:  {filter: filter}
        });
        jqxhr
            .done(function(data, textStatus, jqXHR ){
                if(data.status){
                    col.items = data.result;
                    col.fetched(true);
                    col.trigger('append', data.result, o);
                }
                else{
                    col.trigger('append-error', data, o);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                col.trigger('error', errorThrown, o);
            })
            .always(function(){
                //none
            });
        return jqxhr;
    };
    return col;
};

/**
 * events:
 * show
 * open
 * close
 * @param tag
 * @param opts
 * @returns {*}
 */
var presentize = function(tag, opts){
    tag.hidden = true;
    tag.ready = false;
    tag.mask = false;

    var setShow = function(cmd){
        tag.hidden = !cmd;
        tag.mask = !cmd;
        tag.update({hidden: tag.hidden});
    };

    tag.on('show', function(cmd){
        setShow(cmd);
    });

    var setReady = function(cmd){
        tag.ready = cmd;
        tag.update({ready: tag.ready});
        if(typeof welcomediv != 'undefined' && welcomediv.parentNode !== null){
            welcomediv.parentNode.removeChild(welcomediv);
            document.body.style.background = 'white';
            document.body.style.overflow = 'auto';
        }
    };

    tag.on('ready', function(cmd){
        setReady(cmd);
    });

    tag.on('refresh', function(){
        console.info('start refreshing');
    });

    return tag;
};

var nest = {

    modelable: function(obj, options){
        return modelize(obj, options);
    },

    collectable: function(obj, options){
        return collectize(obj, options);
    },

    presentable: function(tag, options){
        return presentize(tag, options);
    },

    viewable: function(options){
        var view = util.extend({}, options);

        view.init = function(ctx){
            this.mount(ctx);
            if(!this.tag){
                throw new Error('tag is not set');
            }
            this.tag.on('view-route-to', function(){
                view.parent.trigger('view-route-to', view);
            });
            this.tag.on('view-route-back', function(){
                view.parent.trigger('view-route-back', view);
            });
            this.tag.on('model-changed', function(action, modelName, modelId){
                view.parent.trigger('app-changed', action, modelName, modelId);
            });
        };

        view.setParent = function(p){
            this.parent = p;
        };

        /**
         * The method is invoked automatically when leaving current view
         * but not closing it yet.
         * Target view will do the final view switching.
         * @param from current view
         * @param to target view
         */
        view.leave = function(from, to){
            from.tag.trigger('leave', to.tag);
        };

        /**
         * The method is invoked automatically when entering target view
         * but not opening it yet.
         * Target view will do the final view switching.
         * @param from current view
         * @param to target view
         */
        view.enter = function(from, to){
            to.tag.trigger('enter', from && from.tag, from && from.context);
        };

        /**
         * The method is invoked automatically when current view is equal to target view.
         */
        view.reenter = function(){
            this.tag.trigger('reenter', this.context);
        };

        view.open = function(){
            this.tag.trigger('open');
        };

        view.close = function(){
            this.tag.trigger('close');
        };

        view.show = function(cmd){
            this.tag.trigger('show', cmd);
        };

        view.equalRoute = function(targetView){
            var currentRoute = this.context && this.context.req.query.route;
            var targetRoute = targetView && targetView.context.req.query.route;
            return currentRoute = currentRoute;
        };
        return view;
    },

    emptyFn: function(){}
};
module.exports = nest;