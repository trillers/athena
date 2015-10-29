var riot = require('seedriot');
var util = require('./util');
var routeParser = function(path) {
    console.info('route to be parsed: ' + path);
    var uriParts = [];
    var defaultUri = '/index';
    var defaultHashPath = '';
    var parts = path.split('#');
    //var uriPath = parts.length==1 ? '' : (parts[0] || defaultUri);
    var hash = parts.length==1 ? parts[0] : parts[1];
    var hashParts = hash.split('?');
    var hashPath = hashParts[0] || defaultHashPath;
    var hashQuery = hashParts[1] || '';

    var request = {};
    request.route = hashPath;
    request.expression = hashPath.indexOf('_')!=-1;
    if(request.expression){
        request.routeKey = hashPath.replace(/_(\w+)/g, '_');
        request.paramList = hashPath.match(/_(\w+)/g);
    }
    else{
        request.routeKey = hashPath;
        request.paramList = [];
    }

    /*
     * remove _ prefix
     */
    var pLen = request.paramList.length;
    for(var i=0; i<pLen; i++ ){
        request.paramList[i] = request.paramList[i].slice(request.paramList[i].indexOf('_')+1);
    }

    var hashQueryParams = {};
    if (hashQuery) {
        hashQuery.split('&').forEach(function(v) {
            var c = v.split('=')
            hashQueryParams[c[0]] = c[1] || '';
        });
    }
    request.query = hashQueryParams;

    var hashPathParts = hashPath.split('/');
    request.module = hashPathParts[0] || '';
    request.topic = hashPathParts[1] || '';
    request.subModule = hashPathParts[2] || '';
    request.subTopic = hashPathParts[3] || '';
    uriParts.push( request );
    //console.info('a request is parsed:');
    //console.info(request);

    return uriParts
};
var spa = function(options){
    riot.observable(this);
    this.history = [];
    this.routeMap = {};
    this.routeViewCache = {};
    this.defaultHash = options && options.defaultHash || '';
};
var proto = {
    init: function(){
        var app = this;
        riot.route.parser(routeParser);
        riot.route(app._doRoute.bind(app));
        this.on('init', function(){
            //var hash = window.location.hash;
            //hash || (hash = app.defaultHash)
            //riot.route(hash);
        });

        this.on('before-view-route-to', app._doBeforeViewRouteTo.bind(app));
        this.on('view-route-to', app._doViewRouteTo.bind(app));
        this.on('view-route-back', app._doViewRouteBack.bind(app));
        //if(window.prdOrNot){
        //    window.onload = function(){
        //        app.trigger('init');
        //    };
        //}else{
        //    riot.compile(function(){
        //        app.trigger('init');
        //    });
        //}
        riot.compile(function(){
            app.trigger('init');
        });
    },

    route: function(route, handler){
        var routeRule = {};
        routeRule.route = route;
        routeRule.handler = handler;
        routeRule.expression = route.indexOf(':')!=-1;
        if(routeRule.expression){
            var paramNames = route.match(/_(:\w+)/g);
            routeRule.routeKey = route.replace(/_(:\w+)/g, '_');

            /*
             * remove _: prefix
             */
            var pLen = paramNames.length;
            for(var i=0; i<pLen; i++ ){
                paramNames[i] = paramNames[i].slice(paramNames[i].indexOf('_:')+2);
            }

            routeRule.paramNames = paramNames;
        }
        else{
            routeRule.paramNames = [];
            routeRule.routeKey = route;
        }

        this.routeMap[routeRule.routeKey] = routeRule;
        console.info('a route rule is added:');
        console.info(routeRule);
    },

    routeView: function(route, view){
        var router = this;
        this.route(route, function(ctx){
            var v = router.routeViewCache[view.name];
            if(!v){
                v = router.routeViewCache[view.name] = view;
                v.setParent(router);
                v.init(ctx);
            }
            v.context = ctx;
            router.trigger('before-view-route-to', v);
            v.route(ctx);
        });
    },

    currentTrigger: function(){
        var tag = this.currentView && this.currentView.tag;
        if(tag){
            tag.trigger.apply(tag, arguments);
        }
    },
    _doBeforeViewRouteTo: function(view){
        if(this.currentView==view && this.currentView.equalRoute(view)){
            this.currentView && this.currentView.reenter();
        }
        else{
            this.currentView && this.currentView.leave(this.currentView, view);
            view.enter(this.currentView, view);
        }
    },
    _doViewRouteTo: function(view){
        this.currentView && this.currentView.show(false);
        this.lastView = this.currentView;
        this.currentView = view;
        this.currentView && this.currentView.show(true);
    },
    _doViewRouteBack: function(view){
        if(this.lastView && this.lastView.context){
            riot.route(this.lastView.context.req.route);
        }
    },

    _doRoute: function(request){
        var app = this;
        var ctx = {
            app: app,
            req: request
        };

        var routeRule = app.routeMap[request.routeKey];
        if(routeRule){
            var params = {};
            if(routeRule.expression){
                var len = routeRule.paramNames.length;
                var name = '';
                for(var i = 0; i<len; i++){
                    name = routeRule.paramNames[i];
                    params[name] = request.paramList[i] || null;
                }
            }
            request.params = params;

            var handler = routeRule.handler;
            if(handler){
                try{
                    handler(ctx);
                }
                catch(e){
                    console.error(e);
                    console.error('500 on ' + request.route + ' :' + e.message);
                    app.trigger('500', request, e);
                }
            }
            else{
                console.info('404 on ' + request.route);
                app.trigger('404', request);
            }
        }
        else{
            console.info('404 on ' + request.route);
            app.trigger('404', request);
        }
    },

    emptyFn: function(){}
};
util.extend(spa.prototype, proto);

module.exports = spa;
