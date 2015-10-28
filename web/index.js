/**
 * Created by Allen on 2015/10/18.
 */
var proOrdev = true;

seajs.config({
    alias: {
        'jquery':'../../components/cmd-jquery/jquery.js',
        //'zepto': '../public/components/zepto/zepto.min',
        'zepto': '../../components/cmd-zepto/zepto',
        //'jqlazyload':'js/app/jquery.lazyload.js',
        'isjs':'js/app/is.js',
        //'jssdk':'js/app/jssdk',
        'util':'js/app/util.js',
        'seedriot':'../../components/cmd-riot/riot+compiler.js'
    },
    vars: {
        'mainpath':'./js/app/index'
    },
    map: [
        ['','']
    ],
    preload: [
        'jquery','util','riot'
    ],
    debug: true,
    base: proOrdev?'/web':'/public',
    charset: 'utf-8'
});
seajs.use('{mainpath}',function(){
    console.info("resource loaded");
});