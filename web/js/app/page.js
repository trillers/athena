/**
 * SPA definition which is the single entry of our mobile site
 */
var page = __page || {};

var Holder = function (state) {
    this.state = state;
};

Holder.prototype.getUrl = function(){
    var hash = window.location.hash || '';
    return this.state.url + hash;
};

Holder.prototype.getBaseUrl = function(){
    return this.state.baseUrl;
};

Holder.prototype.setTitle = function(title){
    this.state.title = title;
    document && (document.title = title);
};

Holder.prototype.saveTop = function(top){
    this.state.top = top;
    document && (document.top = top);
};

Holder.prototype.getTop = function(){
    return this.state.top;
};

Holder.prototype.getUser = function(){
    return this.state.user;
};

Holder.prototype.getUser = function(){
    return this.state.user;
};

__page.holder = function () {
    if (!__page._holder) {
        __page._holder = new Holder(__page);
    }
    return __page._holder;
};

module.exports = __page.holder();