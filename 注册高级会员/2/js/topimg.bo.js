//活动轮播图
var picCount = $("#activity").val();
	$(".pic-num1").css("width",(picCount*30)+"px");
	var forEach = function(array, callback){
		for (var i = 0, len = array.length; i < len; i++) { callback.call(this, array[i], i); }
	}
	var st = createPicMove("idContainer2", "idSlider2", picCount);	//图片数量更改后需更改此数值
	var nums = [];
	//插入数字
	for(var i = 0, n = st._count - 1; i <= n;i++){
		var li = document.createElement("li");
		nums[i] = document.getElementById("idNum").appendChild(li);
	}
	//设置按钮样式
	st.onStart = function(){
		//forEach(nums, function(o, i){ o.className = ""})
		forEach(nums, function(o, i){ o.className = st.Index == i ? "new-tbl-cell on" : "new-tbl-cell"; })
	}
	// 重新设置浮动
	$("#idSlider2").css("position","relative");
	
	var _initX = 0;
	var _finishX = 0;
	var _startX = 0;
	var _startY = 0;
	function touchStart(event) {
		_startX = event.touches[0].clientX;
		_startY = event.touches[0].clientY;
		_initX = _startX;
	}
	function touchMove(event) {
		var touches = event.touches;
		var _endX = event.touches[0].clientX;
		var _endY = event.touches[0].clientY;
		if(Math.abs(_endY-_startY)>Math.abs(_endX-_startX)){
			return;		
		}
		event.preventDefault();
		_finishX = _endX;
		var _absX = Math.abs(_endX-_startX);
		var lastX = $('#idSlider2').css('left').replace('px','');
		if(_startX>_endX){
			st.Stop();
			$('#idSlider2').css('left',(parseInt(lastX)-_absX)+'px');
		}else{
			st.Stop();
			$('#idSlider2').css('left',(parseInt(lastX)+_absX)+'px');
		} 
		_startX = _endX;
	}
	//触屏  离开屏幕事件
	function touchEnd(event) {
		if(_finishX==0){
			return;
		}
		if(_initX>_finishX){
			bindEvent(_initX,_finishX);
		}else if(_initX<_finishX){
			bindEvent(_initX,_finishX);
		}
		_initX = 0;
		_finishX = 0;
	}

    /**
     *  绑定触屏触发事件
     * @param start
     * @param end
     */
    function bindEvent(start,end){
         if (start >= end) {
                   st.Next();
                } else {
                    st.Previous();
                }
    }
	st.Run();
	var resetScrollEle = function(){
		$("#shelper").css("width",$("#newkeyword").width()+"px");
		var slider2Li = $("#idSlider2 li");
		slider2Li.css("width",$(".scroll-wrapper").width()+"px");
		$("#shelper").css("width",$("#newkeyword").width()+"px");
	}
	
	window.addEventListener("resize",function(){
		st.Change = st._slider.offsetWidth/st._count;
		st.Next();
		resetScrollEle();
	});
	window.addEventListener("orientationchange",function(){
		st.Change = st._slider.offsetWidth/st._count;
		st.Next();
		resetScrollEle();
	})
	resetScrollEle();
	
		$(function(){
    	//根据cookie判断用户是否已经主动取消，主动取消了则不再出现提醒
    	var cookieName="ucTip";
    	var cancel = false;
        var start = document.cookie.indexOf(cookieName+"=");
        if (start !=-1) {
            start = start+cookieName.length+1;
            var end = document.cookie.indexOf(";",start);
            if (end==-1) {end = document.cookie.length;}
            var ucTip = document.cookie.substring(start,end);
    		if(ucTip=='1'){
    			cancel = true; 
    		}
    	}
    	if(!cancel){
    		//外层div元素
    		var ucElement = $('<div>').attr('id','ucTip').css({"position":"fixed","bottom":"30%","z-index":"10001","border":"0","display":"none"});
    		//frame元素，目前UC只支持该接入类型
    		var ucFrame = $('<iframe>').css({"height":"160px","width":"320px","border":"0px"}).attr('src','');
    		ucElement.append(ucFrame);
    		//将元素添加到页面
    		$('body').append(ucElement);
    		//回调方法
    		window.addEventListener("message",function(event){
    			var dt = event.data.type;
    			var dm = event.data.message;
    			//判断出现的情况
    			if(dm!='not android uc' && dm!='not exist' && dm!='browser version error' && dm!='already exist' && dm!=undefined){
    				$('#ucTip').show();
    			}
    			//判断隐藏的情况
    			if (dm == 'success' || dm=='cancle' || dm=='close'){
        			$('#ucTip').hide();
    				//如果用户主动取消，则记录到cookie，30天内不再提醒
    				if(dm=='cancle'){
    					var expires = new Date();
    					expires.setTime(expires.getTime() + 30*24*60*60*1000);
    					document.cookie=cookieName+'=1;expires='+expires.toGMTString()+';path=/';
    					document.cookie=cookieName+'=1;expires='+expires.toGMTString()+';path=/';
    				}
        		}
    		},false);
    	}
    });
		function clickResponse(obj){
		$('[res]').removeClass('on');
		$(obj).addClass('on');
		setTimeout(function(){
			$(obj).removeClass('on');
		},700);
	}
	$("#newkeyword").focus(function(){
		setTimeout(function(){
			 window.scrollTo(0,$("#newkeyword").offset().top-60);
		 },10);		
	});
	$(document).ready(function(){
		$("#categoryMenu li").addClass("route");
	})
	
