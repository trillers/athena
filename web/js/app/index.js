/**
 * SPA definition which is the single entry of our mobile site
 */
var riot = require('seedriot');
require('./tags')();
var agent = require('./agent').init();
var util = require('./util');

var Spa = require('./spa');
var app = new Spa({defaultHash: 'cvs/index'});

app.routeView('cvs/index', nest.viewable({
  name: 'cvs/index',
  mount: function(ctx){
    var tags = riot.mount('cvs-index', {filter: ctx.req.query, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('cvs/query', nest.viewable({
  name: 'cvs/query',
  mount: function(ctx){
    var tags = riot.mount('cvs-query', {filter: ctx.req.query, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('cvs/_:id', nest.viewable({
  name: 'cvs/_:id',
  mount: function(ctx){
    var tags = riot.mount('cvs-messages', {_id: ctx.req.params.id, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open', {_id: ctx.req.params.id, share: ctx.req.query.share, guest: ctx.req.query.guest});
  }
}));

app.routeView('cs/index', nest.viewable({
  name: 'cs/index',
  mount: function(ctx){
    var tags = riot.mount('cs-index', {filter: ctx.req.query, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('cs/query', nest.viewable({
  name: 'cs/query',
  mount: function(ctx){
    var tags = riot.mount('cs-query', {filter: ctx.req.query, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('customer/index', nest.viewable({
  name: 'customer/index',
  mount: function(ctx){
    var tags = riot.mount('customer-index', {filter: ctx.req.query, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('customer/query', nest.viewable({
  name: 'customer/query',
  mount: function(ctx){
    var tags = riot.mount('customer-query', {filter: ctx.req.query, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('assistant/query', nest.viewable({
  name: 'assistant/query',
  mount: function(ctx){
    var tags = riot.mount('assistant-query', {filter: ctx.req.query, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open', ctx.req.query);
  }
}));
app.on('init', function(){
  var attentionUrl = util.getCookie('attentionUrl');
  var hash = attentionUrl || window.location.hash;
  hash || (hash = app.defaultHash);
  riot.mount('top-menu');
  riot.route(hash);
  if(attentionUrl){
    util.setCookie('attentionUrl', "", -1);
  }
});

app.init();

module.exports = app;