//��ֲ�ͼ
var picCount = $("#activity").val();
	$(".pic-num1").css("width",(picCount*30)+"px");
	var forEach = function(array, callback){
		for (var i = 0, len = array.length; i < len; i++) { callback.call(this, array[i], i); }
	}
	var st = createPicMove("idContainer2", "idSlider2", picCount);	//ͼƬ�������ĺ�����Ĵ���ֵ
	var nums = [];
	//��������
	for(var i = 0, n = st._count - 1; i <= n;i++){
		var li = document.createElement("li");
		nums[i] = document.getElementById("idNum").appendChild(li);
	}
	//���ð�ť��ʽ
	st.onStart = function(){
		//forEach(nums, function(o, i){ o.className = ""})
		forEach(nums, function(o, i){ o.className = st.Index == i ? "new-tbl-cell on" : "new-tbl-cell"; })
	}
	// �������ø���
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
	//����  �뿪��Ļ�¼�
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
     *  �󶨴��������¼�
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
    	//����cookie�ж��û��Ƿ��Ѿ�����ȡ��������ȡ�������ٳ�������
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
    		//���divԪ��
    		var ucElement = $('<div>').attr('id','ucTip').css({"position":"fixed","bottom":"30%","z-index":"10001","border":"0","display":"none"});
    		//frameԪ�أ�ĿǰUCֻ֧�ָý�������
    		var ucFrame = $('<iframe>').css({"height":"160px","width":"320px","border":"0px"}).attr('src','');
    		ucElement.append(ucFrame);
    		//��Ԫ����ӵ�ҳ��
    		$('body').append(ucElement);
    		//�ص�����
    		window.addEventListener("message",function(event){
    			var dt = event.data.type;
    			var dm = event.data.message;
    			//�жϳ��ֵ����
    			if(dm!='not android uc' && dm!='not exist' && dm!='browser version error' && dm!='already exist' && dm!=undefined){
    				$('#ucTip').show();
    			}
    			//�ж����ص����
    			if (dm == 'success' || dm=='cancle' || dm=='close'){
        			$('#ucTip').hide();
    				//����û�����ȡ�������¼��cookie��30���ڲ�������
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
	
