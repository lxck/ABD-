(function($, exports) {
    var Share = {};
    exports.Share = Share;

    /**
     * 统一的分享：（根据应用环境选择分享方式）
     * title			分享的标题
     * desc			分享的详细描述
     * link			分享的链接
     * imgUrl		图片url
     */
    Share.openShare = function(title, desc, link, imgUrl) {
		if (String.isBlank(title) || String.isBlank(link)) {
		    alert("分享的标题、链接不能为空");
		    return;
		}
	
		imgUrl = imgUrl;// || "//image.benlailife.com/wap/images/Icon120.png";
		if (isWeiXin()) {
		    desc = desc || "";
		    Share.openWxShare(title, desc, link, imgUrl, true);
		}
    }

    /**
     * 微信分享
     * title			分享的标题
     * desc			分享的详细描述
     * link			分享的链接
     * imgUrl		图片url
     */
    Share.openWxShare = function(title, desc, link, imgUrl) {
		if (!$.isWeiXin()) {
		    return;
		}
		
		// 如果指定跳转的url,则使用，否则自动获取当前的url
		var url = window.location.href.split('#')[0]; // 用js获取当前页面除去'#'hash部分的链接,页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败。
		// 后台签名的url一定是使用jssdk的当前页面的完整url除去'#'部分
		var regParm = {
		    url : url
		}; 
		// 通过config接口注入权限验证配置
		$.post(ctx + "/api/wx/initJsApiConfig", regParm, function(result) {
			if(result.code != 1){
				alert(result.message);
				return;
			}
			
			// 初始化配置
			var data = result.data;
			wx.config({
			    debug : false,
			    appId : data.appId,
			    timestamp : data.timestamp,
			    nonceStr : data.noncestr,
			    signature : data.sign,
			    jsApiList : ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo'],
			    success : function(el) {
			    	console.log("wx config success");
			    },
			    fail : function(el) {
			    	console.log("wx config fail");
			    }
			});
	
			wx.ready(function() {
			    wx.checkJsApi({
					jsApiList : ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo'],
					success : function(res) {
					    $.publish("checkJsApi");
					},
					fail : function() {
					    alert('您的微信当前版本不支持此分享功能!');
					}
			    });
			    
			    var paramObj = {
			    	title : title, // 分享标题
					desc : desc, // 分享描述
					link : link, // 分享链接
					imgUrl : imgUrl, // 分享图标
					success : function() {
					    // alert("分享成功！");
						$.publish("shareSuccess");
					},
					cancel : function() {
					    // alert("分享失败！");
						$.publish("shareCancel");
					}
			    }; 
			    
			    // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
			    wx.onMenuShareTimeline(paramObj);
			    
			    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
			    wx.onMenuShareAppMessage(paramObj);
	
			    // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
			    //wx.onMenuShareQQ(paramObj);
			    
			    // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
			    wx.onMenuShareWeibo(paramObj);
			    
			    // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
			    //wx.onMenuShareQZone(paramObj);
			});
		}, "json");
    }
})($, window);