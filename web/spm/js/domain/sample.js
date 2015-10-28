//var h2 = require('../h2');
//var domain = h2.domain();
//var rest = h2.rest;
//var Message = h2.msg; // error, input, output/result
//
//var Actions = domain.createActions([
//    'activity-create', 'activity-like', 'activity-apply'
//]);
//
//Actions.createActivity.on(function(activityId){
//    //TODO:
//});
//Actions.likeActivity.on(function(activityId){
//    var Activity = this.domain('activity');
//    var cache = this.cache();
//    var activity = cache('activity', activityId);
//    activity.like(userId);
//
//    var api = ;
//    api.complete(function(activityResult){
//        var activityResult
//    });
//});
//
//Actions.recallActivity = domain.createAction({
//    name: 'activity-recall'
//});
//
//Actions.recallActivity.on(function(activityId){
//    //TODO:...
//
//    Actions.recallActivity.completed(result);
//    Actions.recallActivity.failed(error);
//
//});
//
//
//tag
//    <div onclick={onLike}>{activityVM.liked ? '取消喜欢': '喜欢'} </div>
//
//    this.activity = this.opts.activity;
//    this.activityVM = null;
//    var self = this;
//
//    this.activityVM.listenTo(activity, 'fetch', function(){
//        extend(activityVM, activity);
//        self.update();
//    });
//
//    this.activityVM.listenTo(activity, 'change', function(){
//        self.update();
//    });
//
//    Actions.fetchActivity.completed.on(function(activity){
//        m -> mv;
//        self.update();
//    });
//
//    Actions.likeActivity.completed.on(function(){
//        self.activityVM.liked = self.activity.liked;
//        self.update();
//    });
//
//    Actions.likeActivity.failed.on(function(){
//        //
//    });
//
//    //this.on('mount', function(){
//    //
//    //});
//
//    this.on('open', function(){
//        Actions.fetchActivity(activityId);
//    });
//
//    onLike(){
//        Actions.likeActivity(activityId);
//    //$.ajax().completed().fail();
//    }
//
//
//var Activity = domain.model({
//    name: 'activity',
//    initialize: function(){
//        var me = this;
//        this.register('like', function(){
//            var apiCall = rest.post('http://localhost/api/pa/_' + this.id + '/like');
//
//            apiCall.complete(function (msg) {
//                if(msg.errcode){
//                    me.trigger('like-failed', Message.getError(msg));
//                }
//                else{
//                    me.trigger('like-completed', Message.getResult(msg));
//                }
//                });
//
//            apiCall.fail(function(){
//
//                });
//            apiCall.send();
//        });
//
//
//    }
//});
//
//
//module.exports = domain;