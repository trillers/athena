var h2 = {};

var util = require('./util');

var _wrong_biz_code = 500;

var ajaxStockErrorList = [
    /*
     * Reserve code (100 - 199) as fundamental errors, such as
     *  network connection errors,
     *  resource is not found,
     *  request is timeout
     *  request is aborted
     */
      {code: 100, msg: 'unknown error'}         //testStatus: null
    , {code: 101, msg: 'ajax request timeout'}  //testStatus: timeout
    , {code: 102, msg: 'ajax request abort'}    //testStatus: abort

    /*
     * Reserve code (200 - 299) as server side errors, such as
     *  authentication errors,
     *  request/response parsing errors,
     *  server side runtime errors
     */
    , {code: 200, msg: 'server side error'}     //testStatus: error
    , {code: 201, msg: 'ajax parser error'}     //testStatus: parsererror

    /*
     * Reserve code (>500) as custom business logic errors,
     * so developers can define them by themselves, but uniqueness
     * should be guaranteed.
     */
    , {code: 500, msg: 'wrong biz code, custom error code should be >500'}
];


var _initErrors = function(map, list){
    for(var i=0; i<list.length; i++){
        var e = list[i];
        map[''+ e.code] = e;
    }
};

var ajaxStockErrors = {};

_initErrors(ajaxStockErrors, ajaxStockErrorList);

var codes = {
      'unknown': '100'
    , 'error': '200'
    , 'wrongcode': '' + _wrong_biz_code
};

var jqAjaxCodes = {
      'timeout': '101'
    , 'abort': '102'
    , 'error': '200'
    , 'parsererror': '201'
};

util.extend(codes, jqAjaxCodes);

var ApiError = function(code, msg){
    this.code = code;
    this.msg = msg;
};

ApiError.prototype.toString = function(){
    return 'code: ' + this.code + ', msg: ' + this.msg;
};

var ApiErrorFactory = {};

ApiErrorFactory.codes = codes;

ApiErrorFactory.ajaxError = function(textStatus, errorThrown){
    var code = !textStatus || !codes[textStatus] ? codes.unknown : codes[textStatus];
    var e = ajaxStockErrors[code];
    return new ApiError(e.code, errorThrown || e.msg);
};

ApiErrorFactory.bizError = function(code, msg){
    var error = new ApiError(code, msg);
    if(code < _wrong_biz_code){
        console.error('wrong biz error code: ' + JSON.stringify(error));
    }
    return error;
};

h2.ApiError = ApiError;
h2.ApiErrorFactory = ApiErrorFactory;

module.exports = h2;
