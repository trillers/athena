var _ = require('underscore');
var Promise = require('bluebird');

//var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
//function isLength(value) {
//    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
//}
//
//function toArray(value) {
//    var length = value ? value.length : 0;
//    if (!isLength(length)) {
//        return values(value);
//    }
//    if (!length) {
//        return [];
//    }
//    return arrayCopy(value);
//}


/**
 * get a resolver from the original node style callback function
 *
 * @param method
 * @param args
 * @param context
 * @returns {Function}
 */
 var getResolver = function (method, args, context) {
    return function (resolve, reject) {
        args.push(function (err) {
            if (err) {
                return reject(err);
            }
            var receivedArgs = _.toArray(arguments);
            // remove the first argument for error
            receivedArgs.shift();
            resolve(receivedArgs.length > 1 ? receivedArgs : receivedArgs[0]);
        });

        method.apply(context, args);
    };
};

/**
 * new a promise from a resolver
 * @param resolver
 * @returns {bluebird} bluebird promise object
 */
var getPromise = function(resolver){
    return new Promise(resolver);
};

/**
 * promisify an original node style callback function
 * @param cbMethod the original node style callback function to be promisified
 * @param ctx cbMethod's context to be run on
 * @returns {bluebird} bluebird promise object
 */
var promisify = function(cbMethod, ctx){
    return getPromise(getResolver(cbMethod, _.toArray(arguments), ctx || this));
};
