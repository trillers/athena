var logger = require('./logging').logger;

//Helpers
var _extend = function(obj, source) {
    for (var prop in source) {
        obj[prop] = source[prop];
    }
    return obj;
};
var _clone = function(source) {
    return _extend({},source);
};
var _defaults = function(obj, source) {
    for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
    }
    return obj;
};
var DefaultSequenceConfiguration, dsc = {
    key: null,
    initialValue: 0,
    step: 100,
    bookStep: 80
};
var _defaultKey = 'global';
var _defaultConfig = {
    key: _defaultKey,
    initialValue: 0,
    step: 1000,
    bookStep: 500
}
var _defaultConverters = {
    toNum: function(){return this.val;},
    toStr: function(){return ''+this.val;}
};

/**
 *  SequenceConfiguration
 */
var SequenceConfiguration, sc;
SequenceConfiguration = sc = function(o, defaults){
    _extend(this, o);
    _defaults(this, defaults||dsc);
    if(!this.key){
        throw new Error('Key is required for SequenceConfiguration object');
    }
};
sc.create = function(o, defaults){
    return new sc(o, defaults);
};
sc.defaultValue = -1;
sc.prototype.setup = function(){
    var key = this.key;
    var redisClient = this.redisClient;
    var redisKey = this.redisKey;
    //TODO: watch and transaction it
    redisClient.exists(redisKey, function(err, result){
        if(err){
            logger.error(err);
            return;
        }
        if(result){
            logger.warn('When setting up, the sequence [' + key + ']\'s redis key [' + redisKey + '] exists');
        }
        else{
            redisClient.set(redisKey, sc.defaultValue, function(err, result){
                if(err){
                    logger.error('When setting up, fail to initialize the sequence [' + key + ']\'s redis key [' + redisKey + ']: ' + err);
                    return;
                }
                logger.info('When setting up, the sequence [' + key + ']\'s redis key [' + redisKey + '] is initialized successfully');
            });
        }
    });
};

/**
 *  SequenceObject
 */
var SequenceObject, so;
SequenceObject = so = function(o){
    _extend(this, o);
};
so.STATES = {
    blank: 'blank',
    booked: 'booked',
    booking: 'booking',
    overflowing: 'overflowing'
};
so.ACTIONS = {
    initialBook: 'initialBook',
    book: 'book'
};

so.create = function(o){
    return new so(o);
};
_extend(so.prototype, _defaultConverters);
so.prototype.book = function(){
    var key = this.key;
    var config = this.config;
    var redisClient = config.redisClient;
    var redisKey = config.redisKey;
    var me = this;

    //Make sure only one book action is executing.
    if(me.actioning){
        return;
    }
    me.actioning = true;

    redisClient.watch(redisKey);
    redisClient.get(redisKey, function(err, result){
        logger.debug('Before booking, the sequence [' + key + ']\'s redis key [' + redisKey + ']\'s value is ' + result);
        if(err){
            me.actioning = false;
            logger.error(err);
            //TODO: save failed book action
            return;
        }
        var multi = redisClient.multi();
        var oldValve = result;
        var newValve = null;
        var actionName = null;
        if(oldValve==sc.defaultValue || oldValve==null){
            actionName = so.ACTIONS.initialBook;
            newValve = config.initialValue + config.step;
            multi.set(redisKey, newValve);
        }
        else {
            actionName = so.ACTIONS.book;
            newValve = Number(oldValve) + config.step;
            multi.incrby(redisKey, config.step);
        }
        multi.exec(function(err, result){
            if(err){
                logger.error(err);
                me.update({
                    state: false,
                    name: actionName
                });
                return;
            }
            me.update({
                state: true,
                name: actionName,
                valve: newValve
            });
        });
    });
};
so.prototype.update = function(action){
    if(action.state){
        if(action.name==so.ACTIONS.initialBook){
            this.pointer = this.config.initialValue;
            this.valve = action.valve;
            this.bookValve = this.pointer + this.config.bookStep;
            this.nextValve = null;
        }
        else{
            if(this.state==so.STATES.blank || this.state==so.STATES.overflowing ){
                this.pointer = action.valve - this.config.step;
                this.valve = action.valve;
                this.bookValve = this.pointer + this.config.bookStep;
                this.nextValve = null;
            }
            else{
                this.nextValve = action.valve;
            }
        }
        this.ready = true;
        this.state = so.STATES.booked;
        logger.debug('The sequence [' + this.key + '] successfully booked a new valve ' + action.valve);
    }
    else{
        if(action.name==so.ACTIONS.initialBook){
            this.ready = false;
            this.state = so.STATES.blank;
        }
        else{
            //this.ready = unknow; //leave it as it was because we do not know
            this.state = so.STATES.booking;
        }
        logger.warn('The sequence [' + this.key + '] failed to book a new value. ' +
            'And currently, its valve is ' + this.valve + ', and its pointer is ' + this.pointer);
    }
    this.actioning = false;
};
so.prototype.check = function(){
    if(this.state==so.STATES.booked){
        this.pointer++;
        if(!this.nextValve){
            if(this.pointer < this.bookValve){
                //Do nothing
            }
            else if(this.pointer < this.valve){
                this.book();
            }
            else{
                this.onOverflow();
            }
        }
        else{
            if(this.pointer < this.valve){
                //Do nothing
            }
            else if(this.pointer == this.valve){
                this.onStep();
            }
            else{
                throw new Error('The sequence [' + this.key + '] is in a illegal internal state');
            }
        }
    }
    else if(this.state==so.STATES.booking){
        this.pointer++;
        if(this.pointer < this.valve){
            this.book();
        }
        else{
            this.onOverflow();
        }
   }
    else if(this.state==so.STATES.overflowing){
        this.pointer++;
        if(!this.nextValve){
            if(this.pointer < this.valve){
                //Do nothing
            }
            else{
                this.onOverflow();
            }
            this.book();
        }
        else{
            this.onStep();
        }
    }
    else{
        this.book();
    }
};
so.prototype.onStep = function(){
    this.pointer = this.nextValve - this.config.step;
    this.valve = this.nextValve;
    this.bookValve = this.pointer + this.config.bookStep;
    this.nextValve = null;
};
so.prototype.onOverflow = function(){
    logger.error('The sequence [' + this.key + '] is ' + so.STATES.overflowing);
    this.state = so.STATES.overflowing;
    var base = (new Date().getTime())*1000;
    this.pointer = base;
    this.valve = base + this.config.step;
    this.nextValve = null;
};
so.prototype.next = function(){
    if(this.ready){
        this.val = this.pointer;
        this.check();
        return this;
    }
    else{
        this.check();
        throw new Error('The sequence [' + this.key + '] is not ready for generating value');
    }
};


/**
 *  SequenceGenerator
 */
var SequenceGenerator, sg;
SequenceGenerator = sg = function(o, configs){
    this.configurationMap = {};
    this.objectMap = {};

    this.options = _clone(o||{});
    _defaults(this.options, sg.defaultOptions);

    if(configs && configs.length){
        var len = configs.length;
        for(var i=0; i<len; i++){
            this.add(configs[i]);
        }
    }
    this.add(_defaultConfig); //Add default key configuration
};
sg.defaultOptions = {
    dsc: dsc,
    defaultKey: _defaultKey,
    useDefaultKey: true,
    keyPrefix: 'seq:',
    redisClient: null
};

/**
 * Add and init a key config to generator
 * @private
 * @param config
 */
sg.prototype.add = function(config){
    var key = config.key;
    if(this.configurationMap[key]){
        throw new Error('Duplicated sequence configuration for the key:' + key);
    }
    var seqConfig = sc.create(config, this.options.dsc);
    seqConfig.redisKey = this.options.keyPrefix + key;
    seqConfig.redisClient = this.options.redisClient;
    this.configurationMap[key] = seqConfig;

    if(this.objectMap[key]){
        throw new Error('Duplicated sequence object for the key:' + key);
    }
    var seqObj = so.create({
        key: key,
        config: seqConfig,
        ready: false,
        state: so.STATES.blank
    });
    _extend(seqObj, seqConfig.converters);
    this.objectMap[key] = seqObj;
};
sg.prototype.setup = function(){
    for(var key in this.configurationMap){
        this.configurationMap[key].setup();
    }
};
sg.prototype.init = function(){
    for(var key in this.objectMap){
        this.objectMap[key].book();
    }
};

sg.prototype.get = function(key){
    var so = this.objectMap[key];
    if(so){
        return so;
    }
    else{
        if(!this.options.useDefaultKey){
            throw new Error('Sequence [' + key + '] is not registered');
        }
        so = this.objectMap[this.options.defaultKey];
        return so;
    }
};
sg.prototype.next = function(key){
    var so = this.objectMap[key];
    if(so){
        return so.next();
    }
    else{
        if(!this.options.useDefaultKey){
            throw new Error('Sequence [' + key + '] is not registered');
        }
        so = this.objectMap[this.options.defaultKey];
        return so.next();
    }
};

module.exports.sc = sc;
module.exports.so = so;
module.exports.sg = sg;
