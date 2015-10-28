/**
 * Created by Administrator on 2015/2/28.
 */
var $ = require('jquery');
var riot = require('seedriot');
var isjs = require('./isjs');
/**
 * 获取本周、下周、本月、下月的开始日期、停止日期
 */
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //
var startHHMMSS = " " + '00' + ":" + '00' + ":" + '00';
var endHHMMSS = " " + '23' + ":" + '59' + ":" + '59';

var nextMonthDate = new Date(); //下月日期
nextMonthDate.setDate(1);
nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
var newYear = nextMonthDate.getYear();
var nextMonth = nextMonthDate.getMonth();
var qnurl = "http://7u2kxz.com2.z0.glb.qiniucdn.com/";
var randomArr = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateRandomStr(n) {
    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += randomArr[id];
    }
    return res;
};

//格局化日期：yyyy-MM-dd
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
}

//格局化日期：yyyy年MM月dd日
function formatChineseDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "年" + mymonth + "月" + myweekday + '日');
}

//获得某月的天数
function getMonthDays(myMonth){
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
    return days;
}

var DATA_DICT = {
    PA:{
        NAME:'活动',
            ACTION:{
            PUBLISH:'发起',
            VIEW:'浏览',
            COLLECT:'收藏',
            APPLICATE:'报名',
            SHARE:'分享',
            LIKES:'点赞'
        }
    }
};

var getDefImg = function(type){
    if(['fa','of','pt','tr','tb','tn','ex','ca','ch'].indexOf(type) > -1){
        return '/public/images/def_img_' + type + '.jpg';
    }else{
        return '/public/images/pabanner.png';
    }
}

var util = {
    getDc:function(){
        return DATA_DICT;
    },
    trim:function(str){
        return string.replace(/( +)$/g,"").replace(/^( +)/g,"");
    },
    extend: function(target, source){
        for(var p in source){
            target[p] = source[p];
        }
        return target;
    },
    setImageHeight:function($){
        var setHeight = Math.round($("#wary").width() * 360 / 640);
        $(".img1").css("height",setHeight);
    },
    dateFormatstr:function(str){
        var datearr = str.split("-");
        return datearr[1] + "/" + datearr[2];
    },
    htmlParser: {
        parse: function(str){
            return str.replace(/<br>/g,'\n');
        },
        unparse: function(str){
            return str.replace(/\\n/g,'<br>');
        }
    },
    dateFormat:function(date,formatstr){
        var delimiter = "";
        var delimiterpos = 0;
        var monthreg = /MM/;
        var dayreg = /dd/;
        var yearregf =/yyyy/;
        var regarr = [monthreg,dayreg,yearregf];
        var fieldarr = [];
        var nowyear = checklength(date.getFullYear().toString());
        var nowmonth = checklength((parseInt(date.getMonth())+1).toString());
        var nowday = checklength((parseInt(date.getDate())).toString());
        var nowdate = "";
        for(var i = 0;i<regarr.length;i++){
            try{
                if(formatstr.match(regarr[i]).index===0){
                    delimiterpos = formatstr.match(regarr[i]).toString().length;
                    delimiter = formatstr.charAt(delimiterpos);
                    fieldarr = formatstr.split(delimiter);
                    break;
                }
            }catch(err){
                console.warn("dateformat failed---"+err);
            }
        }
        for(fieldkey in fieldarr){
            for(regkey in regarr){
                if(fieldarr[fieldkey].match(regarr[regkey])){
                    switch (fieldarr[fieldkey].match(regarr[regkey]).toString()){
                        case 'yyyy': formatstr = formatstr.replace('yyyy',nowyear);
                        case 'MM': formatstr = formatstr.replace('MM',nowmonth);
                        case 'dd': formatstr = formatstr.replace('dd',nowday);
                    }
                }
            }
        }
        function checklength(str){
            if(str.length<2){
                str = "0"+str;
            }
            return str;
        }
        return formatstr;
    },
    getDateWeek:function(date){
        var weekday = new Array("周日","周一","周二","周三","周四","周五","周六");
        return weekday[date.getDay()];
    },
    validator:function(){
        return isjs;
    },
    uploadtips: function(options, msg){
        if(options === 'show'){
            var wedgtw = 200;
            var winwidth = $("#wary").outerWidth();
            var leftdis = (parseInt(winwidth)-wedgtw)/2;
            var html = '<div id="uploadtips" style="position: absolute;z-index: 99999999999999;top:100px;left:' + leftdis + 'px;width:200px;height:60px;background-color:rgba(0,0,0,0.6);border-radius: 5px;line-height: 60px;text-align: center;color:white">'+
                '<span>'+ msg +'</span>'+
                '</div>';
            $("#wary").append(html);
        }else{
            $("#uploadtips").remove();
        }

    },
    //api
    plugin:function($){
        (function(){
            $.fn.plg1=function(options){

            };
        })($)
        return $;
    },
    tipssuccess:function(i,msg,options){
        var winwidth = $("#wary").outerWidth();
        var winheight = parseInt(winwidth)*(0.31)-20+"px";
        var imgs = ["/public/images/5.0.2.png","/public/images/5.0.1.png"];
        var html = '<div class="succeed display_none" style="height:'+winheight+';z-index: 999;border-radius: 8px;background:rgba(0,0,0,0.6);text-align: center;">' +
            '<img id="tipsimg" style="width:50%;display:inline-block;" src='+imgs[i]+' />' +
            '<p id="tipsmsg" style="color:white;margin-top:10px;font-size:12px;">'+msg+'</p>' +
            '</div>';
        if(options){
            winheight = parseInt(winwidth)*(0.32)-20+"px";
            html = '<div class="succeed display_none" style="margin-left:-27.5%;width:55%;z-index: 999;height:'+winheight+';border-radius: 8px;background:rgba(0,0,0,0.6);text-align: center;">' +
            '<img id="tipsimg" style="width:30%;display:inline-block;" src='+imgs[i]+' />' +
            '<p id="tipsmsg" style="color:white;margin-top:10px">'+msg+'</p>' +
            '</div>';
        }
        $("#wary").append(html);
        var obj = $(".succeed");
        if(options){
            var rewinwidth = $(window).width();
            $(window).on('resize',function(){
                rewinwidth = $(window).width();
                var winwidth = obj.outerWidth();
                var winheight = parseInt(winwidth)-70;
                if(rewinwidth>430){
                    winheight = parseInt(winwidth)-90;
                }if(rewinwidth>768){
                    winheight = parseInt(winwidth)-150;
                }
                obj.height(winheight);
            });
        }
        else{
            $(window).on('resize',function(){
                var winwidth = obj.outerWidth();
                var winheight = parseInt(winwidth)-20;
                obj.height(winheight);
            });
        };
        function showtips(){
            var wintop = $(window).scrollTop();
            obj.show().css("top",wintop+120+"px");
        }
        setTimeout(showtips,100);
        setTimeout(hidedelay,1000);
        function hidedelay(){
            obj.animate({opacity:0},1000,function(){
                $(".succeed").remove();
            });
        }
    },
    getBrowser:function(){
        var browser = {
            versions: function() {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {//移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            },
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        return browser.versions();
    },
    getWxhref:function(){
        var wxhref = util.getBrowser().android ? 'weixin://profile/gh_ad1cd17862c0' : 'http://mp.weixin.qq.com/s?__biz=MzA3MjIwNTk4Mg==&mid=204371161&idx=1&sn=51f61cc7634389147a7050a5a2e97a6f#rd';

        return wxhref;
    },
    compareDate:function(datestra,datestrb){
        var Datea = new Date(datestra);
        var Dateb = new Date(datestrb);
        return Date.parse(Datea)>Date.parse(Dateb);
    },
    formatDate: function (dateTimeStamp) {
        //JavaScript函数：
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - new Date(dateTimeStamp);
        if (diffValue < 0) {
            //若日期不符则弹出窗口告之
            //alert("结束日期不能小于开始日期！");
        }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        if (monthC >= 1) {
            result = parseInt(monthC) + "个月前";
        }
        else if (weekC >= 1) {
            result = parseInt(weekC) + "周前";
        }
        else if (dayC >= 1) {
            result = parseInt(dayC) + "天前";
        }
        else if (hourC >= 1) {
            result = parseInt(hourC) + "小时前";
        }
        else if (minC >= 1) {
            result = parseInt(minC) + "分钟前";
        } else
            result = "刚刚";
        return result;

    },

    parseImgUrl : function(img){
        var return_url = "";
        return_url = img.meta && img.meta!="" && img.meta.split('|')[0] != 'undefined' && this.imageAdaptCfg4qn_copy.getCfg(img.meta.split('|')[0],img.meta.split('|')[1],img.url) || img.url;
        return 'http://' + return_url;
    },

    calcImageUrl:function(item){
        var return_url = "";
        if(item.images && item.images[0]){
            var img = item.images[0];
            //Qn image
            if(img.url && img.url!='' ){
                return_url = img.meta && img.meta!="" && img.meta.split('|')[0] != 'undefined' && this.imageAdaptCfg4qn.getCfg(img.meta.split('|')[0],img.meta.split('|')[1],img.url) || img.url;
            }
            //Wx image
            else if(img.mediaId && img.mediaId!=""){
                if(util.getBrowser().ios === true && img.name){
                    return_url = qnurl + img.name + '?imageMogr2/auto-orient';
                }else {
                    return_url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=" + __page.at + "&media_id=" + img.mediaId;
                }
            }
            //Default image
            else{
                return_url = item && item.tags.type && item.tags.type[0] && getDefImg(item.tags.type[0]) || item.pics && item.pics[0] || "/public/images/pabanner.png";
            }
        }else if(item.coverPics && item.coverPics[0]){
            var img = item.coverPics[0];
            if(img!='' ){
                return_url = img;
            }else{
                return_url = item.pics && item.pics[0] || "/public/images/pabanner.png";
            }
        }else{
            return_url = item && item.tags.type && item.tags.type[0] && getDefImg(item.tags.type[0]) || item.pics && item.pics[0] || "/public/images/pabanner.png";
        }
        return return_url;
    },

    sharepic :function(item){
        var return_url = "";
        if(item.images && item.images[0]){
            var img = item.images[0];
            if(img.url && img.url!='' ){
                return return_url = img.meta && img.meta!="" && img.meta.split('|')[0] != 'undefined' && (this.imageAdaptCfg4qn.getCfg(img.meta.split('|')[0],img.meta.split('|')[1],img.url).split('?')[0] + '?imageMogr2/auto-orient') || img.url;
            }else{
                return util.calcImageUrl.call(this,item);
            }
        }else{
            return util.calcImageUrl.call(this,item);
        }
    },
    getYesterday:function(timestamp){
        var  yesterday_milliseconds=timestamp-1000*60*60*24;
        var  yesterday=new Date();
        yesterday.setTime(yesterday_milliseconds);
        var strYear=yesterday.getFullYear();
        var strDay=yesterday.getDate();
        var strMonth=yesterday.getMonth()+1;
        if(strMonth<10)
        {
            strMonth="0"+strMonth;
        }
        var strYesterday=strYear+"-"+strMonth+"-"+strDay;
        return strYesterday;
    },
    //crop from center
    imageAdaptCfg4qn:{
        viewportw:window.outerWidth >= 640 && 640 || document.documentElement.clientWidth || window.innerWidth,
        usragent:function(){
            return util.getBrowser();
        },
        getviewporth:function(basewidth){
            return basewidth * this.rate.toFixed(0);
        },
        rate:0.5625,
        mogroptions:{
            autoorient:"auto-orient"
        },
        getmogroptions:function(){
            var mogruri = "imageMogr2/";
            for(var p in this.mogroptions){
                mogruri += this.mogroptions[p];
            };
            return mogruri;
        },
        getCfg:function(w, h, url){
            var orate = w && h && (h/w).toFixed(2),
                realw = 0,
                realh = 0,
                realviewportw = this.viewportw,
                realviewporth = 0,
                originaluri = "";
            if(this.usragent().ios === true) { realviewportw = this.viewportw *2 };
            if(orate > this.rate){
                realw = w > realviewportw && realviewportw || w;
                realh = (realw * this.rate+1).toFixed(0);
            }
            else{
                realviewporth = this.getviewporth(realviewportw);
                realh = h > realviewporth && realviewporth || h;
                realw = (realh / this.rate+1).toFixed(0);
            }
            originaluri = "?imageView2/1/w/" + realw + "/h/" + realh + "|" + this.getmogroptions();
            url += originaluri;
            return url;
        }
    },
    imageAdaptCfg4qn_copy:{
        viewportw:window.outerWidth >= 640 && 640 || document.documentElement.clientWidth || window.innerWidth,
        usragent:function(){
            return util.getBrowser();
        },
        getviewporth:function(basewidth){
            return basewidth * this.rate.toFixed(0);
        },
        rate:1,
        mogroptions:{
            autoorient:"auto-orient"
        },
        getmogroptions:function(){
            var mogruri = "imageMogr2/";
            for(var p in this.mogroptions){
                mogruri += this.mogroptions[p];
            };
            return mogruri;
        },
        getCfg:function(w, h, url){
            var orate = w && h && (h/w).toFixed(2),
                realw = 0,
                realh = 0,
                realviewportw = this.viewportw,
                realviewporth = 0,
                originaluri = "";
            if(this.usragent().ios === true) { realviewportw = this.viewportw *2 };
            if(orate > this.rate){
                realw = w > realviewportw && realviewportw || w;
                realh = (realw * this.rate+1).toFixed(0);
            }
            else{
                realviewporth = this.getviewporth(realviewportw);
                realh = h > realviewporth && realviewporth || h;
                realw = (realh / this.rate+1).toFixed(0);
            }
            originaluri = "?imageView2/1/w/" + realw + "/h/" + realh + "|" + this.getmogroptions();
            url += originaluri;
            return url;
        }
    },
    convertToValue:function(arr){
        var arr = arr || [],newarr = [];
        for(var i = 0,len = arr.length; i < len; i+=1){
            newarr[i] = __app.enums.TypeTags.values[arr[i]];
        }
        return newarr;
    },

    getFileName:function(){
        return generateRandomStr(3)+((new Date()).getTime()).toString();
    },

    replaceImgTemplate:function(template){
        return template.replace(/\%\%(.*?)\%\%/g,'<img filename="$1" src="http://7u2kxz.com2.z0.glb.qiniucdn.com/$1">');
    },

    formatChineseDate:function(date){
        return formatChineseDate(date);
    },
    //获得所给日期的开始日期
    getDateStartTime: function (date) {
        return formatDate(date) + startHHMMSS;
    },
    //获得所给日期的结束日期
    getDateEndTime: function (date) {
        return formatDate(date) + endHHMMSS;
    },
    //获得加上给定天数的日期
    getAddedDaysTime: function(date, i){
        var day = date.getDate();
        day = day + i;
        return new Date(date.setDate(day));
    },
    //获得最近三天的开始日期
    getLastDayStartDate: function () {
        var LastDayStartDate = new Date(nowYear, nowMonth, nowDay);
        return formatDate(LastDayStartDate) + startHHMMSS;
    },

    //获得最近三天的停止日期
    getLastDayEndDate: function () {
        var LastDayEndDate = new Date(nowYear, nowMonth, nowDay + 3);
        return formatDate(LastDayEndDate) + endHHMMSS;
    },

    //获得本周的开始日期
    getWeekStartDate: function () {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
        return formatDate(weekStartDate) + startHHMMSS;
    },

    //获得本周的停止日期
    getWeekEndDate: function () {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
        return formatDate(weekEndDate) + endHHMMSS;
    },

    //获得下周的开始日期
    getNextWeekStartDate: function () {
        var nextWeekStartDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek) + 1);
        return formatDate(nextWeekStartDate) + startHHMMSS;
    },

    //获得下周的停止日期
    getNextWeekEndDate: function () {
        var nextWeekEndDate = new Date(nowYear, nowMonth, nowDay + (14 - nowDayOfWeek));
        return formatDate(nextWeekEndDate) + endHHMMSS;
    },

    //获得本月的开始日期
    getMonthStartDate: function () {
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        return formatDate(monthStartDate) + startHHMMSS;
    },

    //获得本月的停止日期
    getMonthEndDate: function () {
        var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
        return formatDate(monthEndDate) + endHHMMSS;
    },

    //获得下月的开始日期
    getNextMonthStartDate: function () {
        var nextMonthStartDate = new Date(nowYear, nextMonth, 1);
        return formatDate(nextMonthStartDate) + startHHMMSS;
    },

    //获得下月的停止日期
    getNextMonthEndDate: function () {
        var nextMonthEndDate = new Date(nowYear, nextMonth, getMonthDays(nextMonth));
        return formatDate(nextMonthEndDate) + endHHMMSS;
    },
    //设置遮罩层禁止操作
    forbidOperation:function(){
        var objDiv = $("<div/>");
        var winheight = $(window).height();
        var bodyheight = $("body").height();
        objDiv.addClass("forbidShadow");
        var setHeight = winheight > bodyheight ? winheight : bodyheight;
        objDiv.css({position:"absolute",top:"0px",left:"0px;",height:setHeight+"px",background:"#000",width:"100%",opacity:"0"}).css("z-index","999");
        $("body").append(objDiv);
    },
    removeforbidOperation:function(){
        if($(".forbidShadow")){
            $(".forbidShadow").remove();
        }

    },
    //设置遮罩层禁止操作2====================================================
    forbidOperation_cp:function(){
        var objDiv = $("<div/>");
        var winheight = $(window).height();
        var bodyheight = $("body").height();
        objDiv.addClass("forbidShadow1");
        var setHeight = winheight > bodyheight ? winheight : bodyheight;
        objDiv.css({position:"absolute",top:"0px",left:"0px;",height:setHeight+"px",background:"#000",width:"100%",opacity:"0"}).css("z-index","999");
        $("body").append(objDiv);
    },
    removeforbidOperation_cp:function(){
        if($(".forbidShadow1")){
            $(".forbidShadow1").remove();
        }

    },
    //设置cookie方法
    setCookie: function (key, val, time) {
        var date = new Date(); //获取当前时间
        var expiresDays = time;  //将date设置为n天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        document.cookie = key + "=" + val + ";expires=" + date.toGMTString();  //设置cookie
    },

    //获取cookie方法
    getCookie: function (key) {
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    }

};
util.wedgt = {
    imgPreviewer: function($container, imgs, options){
        var me = this;
        var i, len, $ul, imgWHRate, imgHeight, startPosX = 0,startPosY = 0, oldPosX = 0, oldPosY = 0, newPosX = 0, newPosY = 0, timer;
        var currentIndex = options.currentIndex || 0, currentMargin = 0;
        var imglen = imgs.length;
        var winw = $container.outerWidth() + 'px';
        var winh = $(window).height() + 'px';
        var changeDis = parseInt(winw,10) * 0.3;
        var html = '<div class="imgPreviewer" style="position:absolute;z-index:44444444;top:0px;left:0px;width:'+ winw +';height:'+ winh +';overflow: hidden;background-color:black">'+
                '<ul class="imgPreviewerUl" style="overflow:hidden;width:'+ (imglen*100) +'%;margin:0px;padding: 0px;transition:all 0.2s ease-out;">';

        for(i = 0; i<imglen; i++){
            imgWHRate = imgs[i].meta.split('|')[0]/imgs[i].meta.split('|')[1];
            imgHeight = (parseInt(winw,10)/imgWHRate);
            html+= '<li style="width:'+(100/imglen)+'%;height:'+winh+';float:left;line-height:'+ winh +'">'+
                '<img src="http://'+ imgs[i].url +'" style="width:100%;height:'+ imgHeight +'px"/>'+
                '</li>';
        }

        html+= '</ul>'+
            '<div style="background-color: rgba(0,0,0,0.4);width:100%;height:80px;line-height: 40px;color:white;position: absolute;bottom:0px;left: 0px;text-align: center"><div style="height:40px;width:100%;line-height: 40px">';

        for(i = 0; i<imglen; i++){
            html+='<span class="picPrevIndexSpan" id="picIndexSpan'+ i +'"></span>';
        }

        html+='</div><p style="text-align:left;text-indent:15px;">'+options.msg+'</p></div></div>';

        $container.append(html);

        renderIndexSpan(currentIndex);

        $container.css({
            height:winh,
            overflow:'hidden'
        });

        $('body').css({
            height:winh,
            overflow:'hidden',
            minHeight:winh
        });

        $ul = $('.imgPreviewerUl');
        document.querySelector('.imgPreviewerUl').addEventListener('touchstart', touchStart, false);
        document.querySelector('.imgPreviewerUl').addEventListener('touchmove', touchMove, false);
        document.querySelector('.imgPreviewerUl').addEventListener('touchend', touchEnd, false);
        document.querySelector('.imgPreviewer').addEventListener('click', removeSelf, false);
        function removeSelf(e){
            $('.imgPreviewerUl').parent().remove();
            $container.css({
                height:'auto',
                overflow:'auto'
            });
            $('body').css({
                height:'auto',
                overflow:'auto',
                minHeight:'auto'
            });
        }
        function touchStart(e){
            e.preventDefault();
            e || (e = window.event);
            currentMargin = parseInt($ul.css('marginLeft'),10);
            timer = (new Date()).getTime();
            startPosX = e.touches[0].pageX;
            startPosY = e.touches[0].pageY;
            oldPosX = e.touches[0].pageX;
            oldPosY = e.touches[0].pageY;
        }
        function touchMove(e){
            e.preventDefault();
            var moveevent = e || window.event;
            newPosX = moveevent.touches[0].pageX;
            newPosY = moveevent.touches[0].pageY;
            if(newPosX > oldPosX && currentIndex === 0 || newPosX < oldPosX && currentIndex === (imglen-1)){
                return;
            }
            if(newPosX < oldPosX){
                $ul.css({
                    'marginLeft': currentMargin - Math.abs(newPosX-startPosX)+'px'
                });
            }else{
                $ul.css({
                    'marginLeft': currentMargin + Math.abs(newPosX-startPosX)+'px'
                });
            }
            oldPosX = newPosX;
        }
        function touchEnd(e){
            var endTime = (new Date()).getTime() - timer, distanceX = newPosX - startPosX, distanceY = newPosY - startPosY, swipeLeft = ((newPosX - startPosX) <0);
            if(( endTime < 100 && newPosX === 0 && newPosY === 0 ) || ( endTime < 100 ) && (Math.abs(distanceX) < 5 && Math.abs(distanceY < 5))){
                removeSelf();
            }
            if(Math.abs(distanceX) >= changeDis && swipeLeft){
                if(currentIndex === (imglen-1)){
                    $ul.css({
                        'marginLeft':'-'+((currentIndex)*parseInt(winw, 10))+'px'
                    });
                    return;
                }
                currentIndex++;
                $ul.css({
                    'marginLeft':'-'+((currentIndex)*parseInt(winw, 10))+'px'
                })
            }else if(Math.abs(distanceX) >= changeDis && !swipeLeft){
                if(currentIndex === 0){
                    $ul.css({
                        'marginLeft':'0px'
                    });
                    return;
                }
                currentIndex--;
                $ul.css({
                    'marginLeft':'-'+((currentIndex)*parseInt(winw, 10))+'px'
                })
            }else{
                $ul.css({
                    'marginLeft':'-'+((currentIndex)*parseInt(winw, 10))+'px'
                });
            }
            renderIndexSpan(currentIndex);
            newPosX = 0; newPosY = 0;
        }
        function renderIndexSpan(index){
            $(".picPrevIndexSpan").each(function(){
                $(this).removeClass('picIndexSpanSelected');
            });
            $("#picIndexSpan"+index).addClass('picIndexSpanSelected');
        }
    }
    //inputDate: function(domid, options){
    //    var me = {};
    //    var self = options.context;
    //    var newdate = self.newdate = new Date(__page.servertime);
    //    me['init'] = function(){
    //        $('#' + domid).val(newdate);
    //    }
    //    self.on('toabsolute',function(){
    //        self.btnbox.style.position = "absolute";
    //        self.btnbox.style.bottom = "0px";
    //        self.btnbox2.style.position = "absolute";
    //        self.btnbox2.style.bottom = "0px";
    //    });
    //
    //    self.on('tofixed',function(){
    //        self.btnbox.style.position = "fixed";
    //        self.btnbox.style.bottom = "0px";
    //        self.btnbox2.style.position = "fixed";
    //        self.btnbox2.style.bottom = "0px";
    //    });
    //
    //    //iphone兼容
    //    var u = navigator.userAgent;
    //    if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    //        self.brithdayClick =  function(e){
    //            self.trigger('toabsolute');
    //        };
    //        self.birthdayBlur = function(e){
    //            self.trigger('tofixed');
    //        };
    //    };
    //
    //    self.birthdayChange = function(e){
    //        var date = document.querySelector('#' + domid);
    //        var dateText = document.querySelector('#' + domid + 'Txt');
    //        if(date.value == "" && util.getBrowser().android ===false){
    //            date.value = newdate;
    //            dateText.value = util.dateFormat(newdate, 'yyyy/MM/dd');
    //            return false;
    //        }
    //        dateText.value = util.dateFormat(new Date(date.value), 'yyyy/MM/dd');
    //    };
    //    return me;
    //}
};
util.wedgt.imgPreviewer['refresh'] = function($container){
    $('.imgPreviewerUl').parent().remove();
    $container.css({
        height:'auto',
        overflow:'auto'
    });
    $('body').css({
        height:'auto',
        overflow:'auto',
        minHeight:'auto'
    });
}
var editorIcon = {
    'Bold': 'boldClass',
    'Italic': 'italicClass',
    'TextAlign': 'textAlignClass',
    'JustifyLeft': 'justifyLeftClass',
    'JustifyCenter': 'justifyCenterClass',
    'JustifyRight': 'justifyRightClass',
    'Img': 'imgClass',
    'Color': 'fontColorClass',
    'redColor': 'colorRedClass',
    'greenColor': 'colorGreenClass',
    'blueColor': 'colorBlueClass',
    'grayColor': 'colorGrayClass',
    'orangeColor': 'colorOrangeClass',
    'purpleColor': 'colorPurpleClass',
    'Size': 'sizeClass',
    'littleSize': 'sizeLittleClass',
    'bigSize': 'sizeBigClass'
}

var editorFontColorConfig = {
    'red' :'red',
    'blue': 'blue',
    'green': 'green',
    'purple': 'purple',
    'orange': 'orange',
    'gray': 'gray'
}

var colorMap = {
    '#ff0000': 'red',
    '#ffa500': 'orange',
    '#0000ff': 'blue',
    '#008000': 'green',
    '#800080': 'purple',
    '#808080': 'gray'
}

util['wedgt']['WcEditor'] = function(opts){
    var me = this;
    this.modules = {};
    for(var prop in opts.modules){
        this.modules[prop] = prop;
    };
    this.container = opts.container;
    this.initialed = false;
    riot.observable(this);
    return this;
};
util['wedgt']['WcEditor']['Module'] = function(module){
    this.name = module.name;
    this.type = module.type;
    this.option = module.option;
    this.cmd = module.cmd;
    this.before = module.before;
    this.after = module.after;
    this.on = false;
};
util['wedgt']['WcEditor']['Module'].prototype = {
    getName: function(){
        return this.name;
    },
    getType: function(){
        return this.type;
    },
    getOption: function(){
        return this.option;
    },
    getCmd: function(){
        return this.cmd;
    },
    getBefore: function(){
        return this.before;
    },
    getAfter: function(){
        return this.after;
    },
    getOn: function(){
        return this.on;
    },
    setOn: function(flag){
        this.on = flag;
    }
};
util['wedgt']['WcEditor'].prototype.init = function(){
    var me = this;
    if(me.initialed){
        return;
    }
    var header = '<ul class="funcheader"></ul>';
    $('#' + this.container).css('overflow', 'hidden');
    $('#' + this.container).append(header);
    $container = $('#' + this.container);
    if(this.modules['Bold']){
        this.addModule(new util['wedgt']['WcEditor'].Module({
            name:this.modules.Bold,
            type:'cmd',
            option: null,
            cmd: {name:'Bold', bool: null, param: null}
        }));
    };
    if(this.modules['Img']){
        this.addModule(new util['wedgt']['WcEditor'].Module({
            name:this.modules.Img,
            type:'cmd',
            cmd: {name:'insertImage', bool: false, param: null},
            before: function(cb){
                var fileName = util.getFileName();
                //operate localIds
                me.off('chooseImgComplete').on('chooseImgComplete', function(localId){
                    if(cb){
                        cb(localId, fileName);
                    }
                })
                me.trigger('chooseImgBegin', {fileName: fileName});
            },
            after: function(localId, fileName, cb){
                $('#contentdiv img:not([fileName])').attr('fileName', fileName).attr('localId', localId);
                if(cb) return cb();
            }
        }));
    }
    if(this.modules['Italic']){
        this.addModule(new util['wedgt']['WcEditor'].Module({
            name:this.modules.Italic,
            type:'cmd',
            option: null,
            cmd: {name:'Italic', bool: null, param: null}
        }));
    }
    if(this.modules['TextAlign']){
        this.addModule(new util['wedgt']['WcEditor'].Module({
            name:this.modules.TextAlign,
            type:'nav',
            option: [{name:'JustifyLeft', bool: null, param: null}, {name:'JustifyCenter', bool: null, param: null}, {name:'JustifyRight', bool: null, param: null}],
            cmd: null
        }));
    }

    if(this.modules['Color']){
        this.addModule(new util['wedgt']['WcEditor'].Module({
            name:this.modules.Color,
            type:'nav',
            option: [{name:'redColor', bool: null, param: editorFontColorConfig['red']}, {name:'blueColor', bool: null, param: editorFontColorConfig['blue']}, {name:'greenColor', bool: null, param: editorFontColorConfig['green']},{name:'orangeColor', bool: null, param: editorFontColorConfig['orange']}, {name:'purpleColor', bool: null, param: editorFontColorConfig['purple']}, {name:'grayColor', bool: null, param: editorFontColorConfig['gray']}],
            cmd: {name:'ForeColor'}
        }));
    }
    if(this.modules['Size']){
        this.addModule(new util['wedgt']['WcEditor'].Module({
            name:this.modules.Size,
            type:'nav',
            option: [{name:'littleSize', bool: null, param: 3}, {name:'bigSize', bool: null, param: 5}],
            cmd: {name:'FontSize'}
        }));
    };
    me.initialed = true;
};
util['wedgt']['WcEditor'].prototype.reset = function(){
    var me = this;
    console.log($container);
    $container.find('.contentcontainer').remove();
    var content = '<div class="contentcontainer"><div id="contentdiv" contenteditable="true" class="editorcontent"></div></div>';
    $container.append(content);
    $(".editorSubMenu").addClass('display_none');
    //$('#contentdiv').off('focus').on('focus', function(e){
    //    $('.funcheader').css({
    //        position: 'fixed',
    //        top: '0px'
    //    })
    //});
    //$('#contentdiv').off('blur').on('blur', function(e){
    //    $('.funcheader').css({
    //        position: 'absolute',
    //        top: '0px'
    //    })
    //});
    $('#contentdiv').css('cursor','pointer').off('touchend').on('touchend', function(e){
        ////scroll to editor top
        //var positionul = $container.offset().top;
        //$(window).scrollTop($(this).offset().top);

        //_getStyleBubble
        var focusNode = me.getFocusPos(function(range){
            me._getStyleBubble($(range.endContainer).parent(), function(modules){
                //_setMenu
                me._setMenu(modules);
            });
        })
        return;
        //???????????
    });
};
util['wedgt']['WcEditor'].prototype._getStyleBubble = function(target, cb){
    var me = this;
    var $currentTarget = $(target);
    var modules = {};
    BubbleDom($currentTarget);
    function BubbleDom( $ct ){
        $currentTarget = $ct;
        if( $currentTarget.attr('id') === 'contentdiv' ){
            return cb(modules);
        }
        if($ct.get(0).tagName === 'FONT'){
            modules['Size'] || $currentTarget.attr('size') && (modules['Size'] = $currentTarget.attr('size'));
            modules['Color'] || $currentTarget.attr('color') && (modules['Color'] = $currentTarget.attr('color'));
        };
        if($ct.get(0).tagName === 'DIV'){
            modules['TextAlign'] || $currentTarget.attr('style') && (modules['TextAlign'] = $currentTarget.css('textAlign'));
        };
        if($ct.get(0).tagName === 'B'){
            modules['Bold'] || (modules['Bold'] = 'Bold');
        };
        if(Object.keys(modules).length === Object.keys(me.modules).length ){
            return cb(modules);
        }
        BubbleDom($currentTarget.parent());
    }
};
util['wedgt']['WcEditor'].prototype._setMenu = function(modules){
    var me = this;
    var meModules = me.modules;
    $('.funcheader').find("input").each(function(){
        var $this = $(this);
        var moduleName = $this.attr('id');
        $this.removeClass(editorIcon[moduleName] + '-h').removeClass(editorIcon[moduleName] + 'Parent-h');
        if(modules[moduleName]){
            if(meModules[moduleName].getType() === 'nav'){
                $this.addClass(editorIcon[moduleName] + 'Parent-h');
                $this.prev().find('input').each(function(){
                    var $this = $(this);
                    var id = $this.attr('id');
                    var regStr = modules[moduleName];
                    var regObj = {};
                    if(moduleName === 'Color'){
                        regStr = colorMap[regStr];
                    }
                    regObj = new RegExp(regStr, 'ig');
                    if(regObj.test(id)){
                        $this.addClass(editorIcon[id] + '-h');
                    }

                });
            }else{
                $this.addClass(editorIcon[moduleName] + 'Parent-h');
            }
        }
    });

};
//custom modules
util['wedgt']['WcEditor'].prototype.addModule = function(opts){
    var me = this;
    me.modules[opts.name] = opts;
    var name = opts.name;
    var cmd = opts.cmd;
    var option = opts.option;
    var hintbefore = opts.before;
    var hintafter = opts.after;
    var btn = '<li class="'+ editorIcon[name] + 'Parent"></li>';
    $('.funcheader').append(btn);
    var html = "<div class='"+ editorIcon[name] +"FuncContainer editorSubMenu display_none'></div>";
    $('.' + editorIcon[name] + 'Parent').append(html);
    if(opts.type === 'nav'){
        _appendFuncInput($('.' + editorIcon[name] + 'Parent'), name, function($input){
            $input.css('cursor','pointer').off('click').on('click', function(){

                $input.addClass(editorIcon[name] + 'Parent-h');

                //place the div
                var left = parseInt($input.prev().outerWidth())/2 - parseInt($input.outerWidth())/2;
                $input.prev().css({
                    marginLeft: '-' + left + 'px'
                });
                //show div
                $('#contentdiv').focus();
                $(".editorSubMenu").not('.' + editorIcon[name] + 'FuncContainer').addClass('display_none');
                $('.' + editorIcon[name] + 'FuncContainer').toggleClass('display_none');
                return false;
            });
        });

        for(var i= 0, len= option.length; i<len; i++){
            (function(i) {
                _appendFuncInput($('.' + editorIcon[name] + 'FuncContainer'), option[i].name, function ($input) {
                    $input.css('cursor','pointer').off('click').on('click', function () {
                        var $parentdiv = $input.parent();
                        $input.toggleClass(editorIcon[option[i].name] + '-h');
                        $('#contentdiv').focus();
                        //hide brother nodes -h class
                        $input.siblings().each(function(i, e){
                            $(this).removeClass(editorIcon[$(this).attr('id')] + '-h');
                        });
                        var command = cmd != null ? cmd.name : option[i].name;
                        document.execCommand(command, option[i].bool, option[i].param);
                        $parentdiv.addClass('display_none');
                        //render the nav bar
                        if(!me._renderNavInput($parentdiv)){
                            $parentdiv.next().removeClass(editorIcon[$parentdiv.next().attr('id')] + 'Parent-h');
                        }
                    })
                });
            })(i);
        }
    }else{
        _appendFuncInput($('.' + editorIcon[name] + 'Parent'), name, function($input){
            $input.css('cursor','pointer').off('click').on('click', function(){
                $input.toggleClass(editorIcon[name] + 'Parent-h');
                $('#contentdiv').focus();
                if(hintbefore){
                    hintbefore(function(cbparam, cbparamafter){
                        document.execCommand(cmd.name, cmd.bool, cbparam);
                        if(hintafter){
                            hintafter(cbparam, cbparamafter, function(){
                                return ;
                            });
                            return ;
                        };
                    });
                }else{
                    $('#contentdiv').focus();
                    document.execCommand(cmd.name, cmd.bool, cmd.param);
                    hintafter && hintafter();

                }
            });
        });
    }

    function _appendFuncInput($currentNode, name, cb){
        var input = "<input id=" + name + " type='button' class='" +  editorIcon[name]  + "'/>"
        $currentNode.append(input);
        cb($("#" + name));
    };
    $(".editorSubMenu").css('cursor','pointer').off('click').on('click', function(){
        return false;
    });
    $(document).css('cursor','pointer');
    $(document).off('click').on('click', function(e){
        $(".editorSubMenu").addClass('display_none');

    });
};
util['wedgt']['WcEditor'].prototype._renderNavInput = function($parentdiv){
    var returnflag = false;
    $parentdiv.find('input').each(function(){
        if($(this).hasClass(editorIcon[$(this).attr('id')] + '-h')){
            returnflag = true;
        }
    });
    return returnflag;
};
util['wedgt']['WcEditor'].prototype.getFocusPos = function(cb){
    setTimeout(function(){
        return cb(document && document.getSelection && ( document.getSelection().rangeCount >0 ) && document.getSelection().getRangeAt(0) || null);
    },100);

};
util['wedgt']['WcEditor'].prototype.getContentHtml = function(){
    return $("#contentdiv").html();
};
util['wedgt']['WcEditor'].prototype.getEncodeContentHtml = function(){
    return encodeURI($("#contentdiv").html());
};
util['wedgt']['WcEditor'].prototype.setContentHtml = function(con){
    var html = decodeURI(con);
    html = html.replace(/<(.*?)script(.*?)>(.*?)<(.*?)\/script(.*?)>/ig, "&lt$1script$2&gt$3&lt$4\/script$5&gt");
    $("#contentdiv").html(html);
};
var touchStart, touchMove, touchEnd;
util.map = {
    _uniqueMap:{},
    _innerEventDispatcher:{
        swipeLeft: function(dom, ctx, options){
            util.map._innerEventDispatcher._swipe(dom, ctx, options);
        },
        swipeRight: function(dom, ctx, options){
            util.map._innerEventDispatcher._swipe(dom, ctx, options);
        },
        tap: function(dom, ctx, options){
            console.log(dom);
            var startTime, endTime, startPosX = 0, startPosY = 0, newPosX, newPosY, distanceX, distanceY, timer = null;
            var touchStart = function(e){
                //e.preventDefault();
                e || (e = window.event);
                startPosX = e.touches[0].pageX;
                startPosY = e.touches[0].pageY;
                newPosX = 0;
                newPosY = 0;
                startTime = (new Date()).getTime();
            };
            var touchMove = function(e){
                var moveevent = e;
                clearTimeout(timer);
                timer = setTimeout(function(e){
                    newPosX = moveevent.touches[0].pageX;
                    newPosY = moveevent.touches[0].pageY;
                }, 100);
            };
            var touchEnd = function(e){
                endTime = (new Date()).getTime(),distanceX = newPosX - startPosX, distanceY = newPosY - startPosY;
                if((((endTime -startTime) < 100) && (newPosX===0 && newPosY===0)) || ((endTime -startTime) < 100) && (distanceX < 5 && distanceY <5)){
                    ctx.trigger('tap');
                }
            };
            if(options === 'off'){
                dom.removeEventListener('touchstart', touchStart, false);
                dom.removeEventListener('touchmove', touchMove, false);
                dom.removeEventListener('touchend', touchEnd, false);
                return;
            };
            dom.addEventListener("touchstart", touchStart, false);
            dom.addEventListener("touchmove", touchMove, false);
            dom.addEventListener("touchend", touchEnd, false);

        },
        _swipe: function(dom, ctx, options){
            var oldPosX = 0, oldPosY = 0, newPosX, newPosY, timer = null;
            var touchStart = function(e){
                e.preventDefault();
                e || (e = window.event);
                oldPosX = e.touches[0].pageX;
            };
            var touchMove = function(e){
                var moveevent = e;
                clearTimeout(timer);
                timer = setTimeout(function(e){
                    newPosX = moveevent.touches[0].pageX;
                }, 100);
            };
            var touchEnd = function(e){
                var touch = e.touches[0], distance = newPosX - oldPosX;
                if(distance > 20){
                    ctx.trigger('swipeRight');
                }else if(distance < 20){
                    alert(11);
                    ctx.trigger('swipeLeft');
                }
            };
            if(options === 'off'){
                dom.removeEventListener('touchstart', touchStart, false);
                dom.removeEventListener('touchmove', touchMove, false);
                dom.removeEventListener('touchend', touchEnd, false);
                return;
            };
            dom.addEventListener("touchstart", touchStart, false);
            dom.addEventListener("touchmove", touchMove, false);
            dom.addEventListener("touchend", touchEnd, false);
        }
    }
}

util.events = {
    observable:function(o, options){
        console.log(o);
        var me = this, unique;
        options && options.unique && (unique = options.unique);
        if(o && o._createdFlag){
            return o;
        }
        if(unique === true){
            if(util && !util.map._uniqueMap[o]){
                util.map._uniqueMap[o] = o;
            }
        }
        var obser = (unique === true) && o || Object.create(o);
        obser_proto = {
            _createdFlag: true,
            on:function(eventName, cbfn){
                if(this._isExst(eventName)){
                    return this;
                };
                var newevent = {};
                newevent[eventName] = cbfn;
                this.events.push(newevent);
                util && util.map._innerEventDispatcher[eventName] && util.map._innerEventDispatcher[eventName](o, obser, 'on');
                return this;
            },
            off:function(eventName){
                var index = this._index(eventName);
                if( index >= 0 ){
                    this.events.splice(index, 1);
                    if(this.events.length === 0){
                        (unique === true) && delete util.map._uniqueMap[o];
                    }
                    util && util.map._innerEventDispatcher[eventName] && util.map._innerEventDispatcher[eventName](o, obser, 'off');
                }
                return this;
            },
            events:[],
            trigger:function(eventName){
                var i, len = this.events.length;
                for(i=0; i < len; i+=1){
                    if(this.events[i][eventName]){
                        return this.events[i][eventName].call(obser);
                    }
                }
            },
            _isExst: function(eventName){
                if(this._index(eventName) >= 0){
                    return true;
                }
                else{
                    return false;
                }
            },
            _index: function(eventName){
                var i, len, eventarr = this.events, result;
                for( i=0,len = eventarr.length; i < len; i+=1){
                    if( eventarr[i][eventName] ){
                        result = i;
                        return result;
                    }
                }
                return -1;
            }
        };
        util.extend(obser, obser_proto);
        return obser;
    },
    _valueToKey:function(obj){
        var result = {};
        for(var prop in obj){
            result[obj[prop]] = prop;
        }
        return result;
    },
    htmlToTemplate: function(html){
        var htmlObj = $(this._wrapdiv(html));
        htmlObj.find('img').each(function(){
            $(this).replaceWith('%%' + $(this).attr('filename') + '%%')
        });
        return htmlObj.html();
    },
    _wrapdiv: function(htmlstr){
        return htmlstr = '<div>' + htmlstr + '</div>';
    },
    _unwrapdiv: function(html){
        return $(html).html();
    }
}
module.exports = util;