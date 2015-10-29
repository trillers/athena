var $ = require('jquery');
$.fn.simslider = function(opts){
	var $banner = this;
	var count = this.find('>ul>li').length;
	var currentindex = 0;
	var defaults = {
		docs:true,
		docscolor:"white"
	};
	var options = $.extend(defaults,opts);
	this.css({
		width:"100%"
	});
	this.find('>ul').css({
		width:count*100+"%",
		position:"relative",
		overflow:"hidden"
	});
	this.find('>ul>li').css({
		width:parseFloat(100/count).toFixed(6)+"%"
	});
	setInterval(slidepic,5000);
	function slidepic(){
		if(currentindex>=(count-1)){
			$banner.find('>ul').css({
				left:0+"%"
			});
			currentindex = 0;
			if(options.docs){
				$banner.find('.bannerdocs').find('li').removeClass('docsihov');
				$banner.find('.bannerdocs').find('li:eq('+(currentindex)+')').addClass('docsihov');
			}
		}
		else{
			$banner.find('>ul').css({
				left:"-"+(currentindex+1)*100+"%"
			});
			if(options.docs){
				$banner.find('.bannerdocs').find('li').removeClass('docsihov');
				$banner.find('.bannerdocs').find('li:eq('+(currentindex+1)+')').addClass('docsihov');
			}
			currentindex++;
		}
	}
	function slidepicOp(){
		if(currentindex<=0){
			$banner.find('>ul').css({
				left:"-"+(count-1)*100+"%"
			});
			currentindex = count-1;
			if(options.docs){
				$banner.find('.bannerdocs').find('li').removeClass('docsihov');
				$banner.find('.bannerdocs').find('li:eq('+(currentindex)+')').addClass('docsihov');
			}
		}
		else{
			$banner.find('>ul').css({
				left:"-"+(currentindex-1)*100+"%"
			});
			if(options.docs){
				$banner.find('.bannerdocs').find('li').removeClass('docsihov');
				$banner.find('.bannerdocs').find('li:eq('+(currentindex-1)+')').addClass('docsihov');
			}
			currentindex--;
		}
	}
	var startX,endPageX;
	function touch_start(event){
		//event.preventDefault();
		var event = event || window.event;
		startX = event.originalEvent.targetTouches[0].pageX;
	};
	function touch_move(event){
		event.preventDefault();
		var event = event || window.event;
		endPageX = event.originalEvent.targetTouches[0].pageX;
	}
	function touch_end(){
		if(startX-endPageX > 100){
			slidepic();
		}else if(endPageX-startX > 100){
			slidepicOp();
		}
	}
	$banner.on("touchstart",touch_start);
	$banner.on("touchmove",touch_move);
	$banner.on("touchend",touch_end);

	if(options.docs){
		var html = "<div class='bannerdocs' style='width:100%;position:absolute;bottom:6px'><ul style='width:"+((6+5)*count)+"px'>";
		for(var i=0;i<count;i++){
			if(i==0){
				html+="<li class='docsihov docsidef' style='display:block;width:6px;height:6px;border-radius:50em;margin-right:5px;'></li>";
				continue;
			}
			html+="<li class='docsidef' style='display:block;width:6px;height:6px;border-radius:50em;margin-right:5px;'></li>";
		}
		html+="</ul></div>";
		$banner.append(html);
	}
}
module.exports = null;


