/**
 * SPA definition which is the single entry of our mobile site
 */
var riot = require('seedriot');
require('./tags')();
var agent = require('./agent').init();
var util = require('./util');

var Spa = require('./spa');
var app = new Spa({defaultHash: 'activity/index'});

app.routeView('debug/index', nest.viewable({
  name: 'debug/index',
  mount: function(ctx){
    var tags = riot.mount('debug-index', {});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open');
  }
}));

app.routeView('activity/index', nest.viewable({
  name: 'activity/index',
  mount: function(ctx){
    var tags = riot.mount('activity-index', {filter: ctx.req.query, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    app.history.push('activity/index');
    this.tag.trigger('open', ctx.req.query);
  }
}));
app.routeView('activity/list', nest.viewable({
    name: 'activity/list',
    mount: function(ctx){
        var tags = riot.mount('activity-list', {filter: ctx.req.query, app: this.parent});
        this.tag = tags[0];
    },
    route: function(ctx){
        this.context = ctx;
        this.parent.currentTrigger('mask');
        app.history.push('activity/list');
        this.tag.trigger('open', ctx.req.query);
    }
}));
app.routeView('mine/index', nest.viewable({
  name: 'mine/index',
  mount: function(ctx){
    var tags = riot.mount('mine-index', {filter: ctx.req.query});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    app.history.push('mine/index');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('travel/index', nest.viewable({
  name: 'travel/index',
  mount: function(ctx){
    var tags = riot.mount('travel-index', {filter: ctx.req.query});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('activity/_:id', nest.viewable({
  name: 'activity/_:id',
  mount: function(ctx){
    var tags = riot.mount('activity-detail', {_id: ctx.req.params.id,app: this.parent });
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', {id: ctx.req.params.id, share: ctx.req.query.share, guest: ctx.req.query.guest});
  }
}));

app.routeView('travel/_:id', nest.viewable({
  name: 'travel/_:id',
  mount: function(ctx){
    var tags = riot.mount('travel-detail', {_id: ctx.req.params.id});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.params.id);
  }
}));

app.routeView('activity/new', nest.viewable({
  name: 'activity/new',
  mount: function(ctx){
    var tags = riot.mount('activity-new', {});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open');
  }
}));

app.routeView('activity/search', nest.viewable({
  name: 'activity/search',
  mount: function(ctx){
    var tags = riot.mount('activity-search', {app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    app.history.push('activity/search');
    this.tag.trigger('open');
  }
}));

app.routeView('activity/edit/_:id', nest.viewable({
  name: 'activity/edit/_:id',
  mount: function(ctx){
    var tags = riot.mount('activity-edit', {_id:ctx.req.params.id});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.params.id);
  }
}));
app.routeView('activity/createsuccess/_:id', nest.viewable({
  name: 'activity/createsuccess/_:id',
  mount: function(ctx){
    var tags = riot.mount('activity-createsuccess', {_id:ctx.req.params.id});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.params.id);
  }
}));

app.routeView('activity/add-randomnotes', nest.viewable({
  name: 'activity/add-randomnotes',
  mount: function(ctx){
    var tags = riot.mount('add-randomnotes', {_id:ctx.req.params.id});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.params.id);
  }
}));

app.on('init', function(){
  var attentionUrl = util.getCookie('attentionUrl');
  var hash = attentionUrl || window.location.hash;
  hash || (hash = app.defaultHash);
  riot.route(hash);
  if(attentionUrl){
    util.setCookie('attentionUrl', "", -1);
  }
});

app.init();

module.exports = app;