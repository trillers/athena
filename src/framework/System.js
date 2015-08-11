var util = require('util');
var u = require('../app/util');
var EventEmitter = require('events').EventEmitter;

var Manager = function(){};
util.inherits(Manager, EventEmitter);

Array.prototype.remove = function(item) {
    var index = this.indexOf(item);
    if (index >= 0) {
        this.splice(index, 1);
        return true;
    }
    return false;
};

var System = function(){
    this.memberList = [];
    this.memberMap = {};
    this.downList = [];
};
var SystemPrototype = {
    startup: function(){
        this.emit('startup');
    },
    shutdown: function(){
        this.emit('shutdown');
    },
    addMember: function(id, member){
        if(this.memberList.indexOf(member)>=0){
            return;
        }
        this.memberList.push(member);
        this.memberMap[id] = member;
        this.downList.push(member);
        member.__sys__ = this;
    },
    memberUp: function(member){
        var registered = this.memberList.indexOf(member)>=0;
        if(!registered) return;
        var found = this.downList.remove(member);
        if(found && this.downList.length==0){
            this.emit('up');
            console.info('system is up');
        }
        else{
            //TODO: member changed: up
        }
    },

    memberDown: function(member){
        var registered = this.memberList.indexOf(member)>=0;
        if(!registered) return;
        var existed = this.downList.indexOf(member)>=0;
        if(!existed && this.downList.length==0){
            this.downList.push(member);
            this.emit('down');
            console.info('system is down');
        }
        else{
            //TODO: member changed: down
        }
    },
    emptyFn: function(){}
};
util.inherits(System, EventEmitter);
u.extend(System.prototype, SystemPrototype);


var Member = function(){

};
MemberPrototype = {
    startup: function(){
        this.__sys__.memberUp(this);
    },
    shutdown: function(){
        this.__sys__.memberDown(this);
    },
    emptyFn: function(){}
};
util.inherits(Member, EventEmitter);
u.extend(Member.prototype, SystemPrototype);

//var sys = new System();
//var app = new Member();
//var redis = new Member();
//var rpc = new Member();
//sys.addMember('app', app);
//sys.addMember('redis', redis);
//sys.addMember('rpc', rpc);
//sys.on('startup', function(){
//    console.info('system is starting up');
//});
//sys.on('shutdown', function(){
//    console.info('system is shutting down');
//});
//sys.on('up', function(){
//    console.info('system is up');
//});
//sys.on('down', function(){
//    console.info('system is down');
//});
//sys.startup();
//app.startup();
//redis.startup();
//rpc.startup();
//rpc.shutdown();
//sys.shutdown();

module.exports = System;
