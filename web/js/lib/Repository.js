define(function(require,exports,module){
    var Repository = function(options){
        var mediator = options.mediator;
        if(mediator){
            this.listenTo(mediator, 'read', this._onRead, this);
            this.listenTo(mediator, 'delete', this._onDelete, this);
        }
        this.data = {};
    };

    _.extend(Repository.prototype, bb.Events, {
        _onRead: function(model, resp, options){
            if(model.models){
                var len = model.models.length;
                var collection = model;
                var Model = collection.model;
                var toReset = new Array(len);
                var toResetLen = 0;
                for(var i=0; i<len; i++){
                    var m = collection.at(i);
                    var cachedModel = this.get(Model.name, m.id);
                    if(cachedModel){
                        cachedModel.set(m.attributes);
                        ++toResetLen;
                        toReset[i] = cachedModel;
                        cachedModel.trigger('update');
                    }
                    else{
                        toReset[i] = m;
                        this.put(Model.name, m.id, m);
                        m.trigger('load');
                    }
                }

                //Replace the existed items in the just fetched collection
                if(toResetLen){
                    collection.reset(toReset, {silent: true});
                    console.log(toResetLen + ' are updated in repository');
                }
            }
            else{
                this.put(model.name, model.id, model);
                model.trigger('load');
            }
        },
        _onDelete: function(model, resp, options){
            this.remove(model.name, model.id);
        },
        get: function(name, id){
            var region = this.data[name];
            var model = region ? region[id] : null;
            return model;
        },
        put: function(name, id, model){
            var region = this.data[name];
            if(!region){
                this.data[name] = region = {};
            }

            var replaced =  region[id] ? true : false;
            region[id] = model;
//            console.info(name + ' ' + id + ' is put');
            return replaced;
        },
        remove: function(name, id){
            var model = this.get(name, id);
            if(model){
                this.data[name][id] = null;
//                console.log(name + ' ' + id + ' is removed');
                return true;
            }
            else{
                return false;
            }
        }
    });

    module.exports = Repository;
});