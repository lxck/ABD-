/** prototype **/
;(function($, exports) {
	if (typeof exports.parseFloatForce !== 'function') {
		exports.parseFloatForce = function(num) {
			var result = parseFloat(num);
			if(isNaN(result)){
	    		return parseFloat(0);
			}else {
	    		return result;
			}
		}
	}
	
	if (typeof String.isBlank !== 'function') {
		String.isBlank = function(str) {
			if(!str) return true;
			return /^\s*$/.test(str);
		} 
	}
	
	if (typeof String.replaceAll !== 'function') {
		String.replaceAll = function(text, searchString, replacement) {
			if(String.isBlank(text)) return null;
			if(String.isBlank(searchString) || String.isBlank(replacement)) return text;
			
			var regExp = new RegExp(searchString, "g");
			return text.replace(regExp, replacement);
		}
	}
	
	if (typeof Function.prototype.method !== 'function') {
		Function.prototype.method = function(funcName, func) {
			this[funcName] = func;
			return this
		}
	}
	/*
	if (typeof Array.prototype.remove !== 'function') {
		Array.prototype.remove = function(dx){
			if(isNaN(dx)||dx>this.length) return false;
		   	delete this[dx];
		}
	}
	
	if (typeof Array.isEmpty !== 'function') {
	    Array.isEmpty = function(array) {
	        if (!$.isArray(array)) return true;
	        return array.length <= 0
	    }
	}
	
	if (typeof Array.prototype.pushAll !== 'function') {
	    Array.prototype.pushAll = function(array) {
	        if (!$.isArray(array)) return this.push(array);
	        for (var i = 0; i < array.length; i++) {
	            this.push(array[i])
	        }
	        return this.length
	    }
	}*/
	
	if (typeof Date.prototype.format !== 'function') {
		/*formatString = "YYYY-MM-DD hh:mm:ss";*/
		Date.prototype.format = function(formatString){
		    var o = {
		        "M+" : this.getMonth()+1,    //month
		        "D+" : this.getDate(),    //day
		        "h+" : this.getHours(),    //hour
		        "m+" : this.getMinutes(),    //minute
		        "s+" : this.getSeconds(),    //second
		        "q+" : Math.floor((this.getMonth()+3)/3),    //quarter
		        "S" : this.getMilliseconds()    //millisecond
		    }
		
		    if(/(Y+)/.test(formatString)){
		        formatString = formatString.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		    }
		
		    for(var k in o){
		        if(new RegExp("("+ k +")").test(formatString)){
		            formatString = formatString.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		        }
		    }
		    return formatString;
		}
	}
	
	if (typeof Object.create !== "function"){
		Object.create = function(o) {
			function F() {}
			F.prototype = o;
			return new F();
		};
	}
	if (typeof Object.isError !== "function"){
		Object.isError = function(obj) {
			return obj instanceof Error;
		};
	}
	
	// 导航
	exports.navigation = function(eword, epointx, epointy){
		window.location.href = 'http://apis.map.qq.com/tools/routeplan/eword='+eword+'&epointx='+epointx+'&epointy='+epointy+'?referer=myapp&key='+mapTxAk;
	}
})($, window);

/** commons **/
;(function($) {
	function parseArguments(url, data, success, dataType) {
		if ($.isFunction(data)) dataType = success, success = data, data = undefined
		if (!$.isFunction(success)) dataType = success, success = undefined
		return {
			url: url,
			data: data,
			success: success,
			dataType: dataType
		}
	}
	
	var commons = {
		toPrice: function(price, precision) {
			var a = price;
			if (a >= 0) {
				a = parseFloat(a);
				return '¥' + a.toFixed(precision || 2)
			}
			return '¥' + price
		},
		requestQueue: [],
		ajaxApiErrorHandler : function(resultData, xhr, type, _this){
			var message = "";
			console.log(xhr);
			console.log(type);
			if("timeout" === type){
				message = "网络繁忙，请稍后重试!";
			}else{
				message = "服务器异常，请稍后重试!";
			}
			$.publish("ajaxApiError", message);
		},
		ajaxApi: function(data) {
			(function(_utils, _data) {
				function AjaxStart() {
					new AjaxRequest()
				}

				function AjaxRequest() {
					this.init()
				}
				AjaxRequest.prototype = {
					init: function() {
						var queryString = $.param(_data.data || {});
						
						this.url = _data.url + (queryString.trim()==="" ? "" : "?"+queryString);
						if (this.validateRequest()) {
							this.beginRequest()
						}
					},
					validateRequest: function() {
						for (var urls in _utils.requestQueue) {
							if (_utils.requestQueue[urls] == this.url) {
								return false
							}
						}
						_utils.requestQueue.push(this.url);
						return true
					},
					beginRequest: function() {
						var _this = this;
						var timeout = _data.timeout;
						_data.timeout = timeout || 30000;
						
						// 成功处理
						var sucessFn = _data.success;
						_data.success = function(resultData) {
							if (sucessFn) {
								if(typeof $.ajaxApiIsSuccess !== "function" || $.ajaxApiIsSuccess(resultData)){
									sucessFn(resultData);
									if(typeof $.ajaxApiSucessHandler == "function"){
										$.ajaxApiSucessHandler();
									}
								} else {
									if (typeof $.ajaxApiErrorHandler == "function") {
										$.ajaxApiErrorHandler(resultData, xhr, type, _this);
									}
									return false;
								}
							}
							
							// 控制重复请求（0.5秒内只对相同url请求1次）
							setTimeout(function() {
								_this.requestDispose();
							}, 500)
						};
						
						// 错误处理
						var errorFn = _data.error;
						_data.error = function(xhr, type) {
							if (typeof $.ajaxApiErrorHandler == "function") {
								$.ajaxApiErrorHandler(null, xhr, type, null);
							} else {
								console.log(xhr);
								console.log(type);
							}
							
							_this.requestDispose();
						};
						
						// 按接口约定处理参数 ... 
						if(typeof $.ajaxApiEncrypting == "function"){
							_data.data = $.ajaxApiEncrypting(_data.data);
						}
						
						$.ajax(_data);
					},
					requestDispose: function() {
						for (var i = 0, j = _utils.requestQueue.length; i < j; i++) {
							if (_utils.requestQueue[i] == this.url) {
								_utils.requestQueue.splice(i, 1);
								return
							}
						}
					}
				};
				AjaxStart()
			})(this, data)
		},
		getApi : function( /* url, data, success, dataType */ ) {
			return this.ajaxApi(parseArguments.apply(null, arguments));
		},
		postApi : function( /* url, data, success, dataType */ ) {
			var options = parseArguments.apply(null, arguments);
			options.type = 'POST';
			return this.ajaxApi(options);
		},
		replace: function(template, data) {
			return template.replace(/{([^{]*?)}/g, function(match, key) {
				return data[key] == null ? match : data[key]
			})
		},
		countDown: function(param) {
			if(!param.end) param.end = new Date();
			var e = {
				g: param.end.getTime(),
				e: param.date.getTime(),
				d: 1000 * 60 * 60 * 24,
				h: 1000 * 60 * 60,
				m: 1000 * 60,
				s: 1000,
				ms: 100
			};
			e.n = e.e - e.g;
			var r = {
				day: '00',
				hour: '00',
				minute: '00',
				second: '00',
				millisecond: '0',
				timeend: true
			};
			if (e.n > 0) {
				r.day = Math.floor(e.n / e.d);
				e.d -= r.day * e.d;
				r.hour = Math.floor(e.n / e.h);
				e.n -= r.hour * e.h;
				r.minute = Math.floor(e.n / e.m);
				e.n -= r.minute * e.m;
				r.second = Math.floor(e.n / e.s);
				e.n -= r.second * e.s;
				r.millisecond = Math.floor(e.n / e.ms);
				for (var a in r) {
					if (a == 'timeend') {
						continue
					}
					if (r[a] > 0) {
						r.timeend = false
					}
					if (r[a] < 10 && a != 'millisecond') {
						r[a] = '0' + r[a]
					} else {
						r[a] = '' + r[a]
					}
				}
			}
			param.data = r;
			param.dom.html(this.replace(param.temp, param.data));
			if (Math.floor((e.e - e.g) / 1000 <= 0) && param.callback) {
				param.callback();
				return
			}
			param.end.setTime(param.end.getTime()+(param.time || 1000));
			this.countDown.Timer = setTimeout($.proxy(function() {
				this.countDown(param);
			}, this), param.time || 1000)
		},
		back: function(){
			var hasHistory = true;
			if(typeof ctx == "undefined") ctx = null;
		    if(!document.referrer || document.referrer.indexOf(ctx) < 0) hasHistory = false;
		    /*if(appUtils.isApp() && !hasHistory){
				 appUtils.goback();
		    } else {
				if(hasHistory){
				    window.history.back();
				} else {
				    window.location.replace(webRoot);
				}
		    }*/
		    if(hasHistory){
			    window.history.back();
			} else {
				var url = ctx + "/wap";
				var userType = $.getCookie("userType");
				switch (userType){
					case '5':// 家护师
						url = ctx + "/wap/jsUser/orderList";
						break;
					case '6':// 普通用户
						break;
					case '10':// 督导
						url = ctx + "/wap/assignManager";
						break;
				}
			    window.location.replace(url + "?time=" + new Date().getTime());
			}
		},
		localParam : function(search, hash) {
            var fn;
            search = search || window.location.search;
            hash = hash || window.location.hash;
            fn = function(str, reg) {
                var data;
                if (str) {
                    data = {};
                    str.replace(reg, function($0, $1, $2, $3) {
                        data[$1] = $3;
                    });
                    return data;
                  }
            };
            return {
                search: fn(search, new RegExp("([^?=&]+)(=([^&]*))?", "g")) || {},
                hash: fn(hash, new RegExp("([^#=&]+)(=([^&]*))?", "g")) || {}
            };
       	},
		getQueryValue: function(a) {
			var b = location.search,
				c = new Array;
			if (b.length > 1) {
				var d = b.indexOf("?");
				b = b.substring(d + 1, b.length)
			} else
				b = null;
			if (b)
				for (var e = 0; e < b.split("&").length; e++)
					c[e] = b.split("&")[e];
			for (var f = 0; f < c.length; f++)
				if (c[f].split("=")[0] == a)
					return decodeURI(c[f].split("=")[1]);
			return ""
		},
		objToUrlSearch: function(obj, key) {
            var paramStr = "";
            if (obj instanceof String || obj instanceof Number || obj instanceof Boolean) {
                paramStr += "&" + key + "=" + encodeURIComponent(obj)
            } else {
                $.each(obj, 
                function(i) {
                    var k = key == null ? i: key + (obj instanceof Array ? "[" + i + "]": "." + i);
                    paramStr += '&' + commons.objToUrlSearch(this, k)
                })
            }
            return paramStr.substr(1)
        },
        changeUrlSearch: function(url, arg, arg_val) {
			var pattern = arg + "=([^&]*)";
			var replaceText = arg + "=" + arg_val;
			if (url.match(pattern)) {
				var tmp = "/(" + arg + "=)([^&]*)/gi";
				return tmp = url.replace(eval(tmp), replaceText)
			}
			return url.match("[?]") ? url + "&" + replaceText : url + "?" + replaceText
		},
		getCtxFromLocation: function(){
			return location.href.substring(0, location.href.indexOf(location.pathname)) + "/boting"
		},
		storage : {
			get: function(key, isLocal) {
				if (this.isLocalStorage()) {
					var c = this.getStorage(isLocal).getItem(key);
					return c && "undefined" != c ? JSON.parse(c) : void null;
				}
			},
			set: function(key, val, isLocal) {
				this.isLocalStorage() && (val = JSON.stringify(val), this.getStorage(isLocal).setItem(key, val));
			},
			remove: function(key, isLocal) {
				this.isLocalStorage() && this.getStorage(isLocal).removeItem(key);
			},
			getStorage: function(isLocal) {
				return isLocal ? localStorage : sessionStorage;
			},
			isLocalStorage: function() {
				try {
					return window.localStorage ? (localStorage.setItem("FORTEST", 1), !0) : (alert("不支持本地存储"), !1);
				} catch (a) {
					return alert("本地存储已关闭"), !1;
				}
			}
		},
		ellipsis : function(str, showLength) {
			str = $.trim(str);
			var c = str.length;
			return c > showLength ? str.substring(0, showLength) + "..." : str;
		},
		ellipsisPhone : function(phone) {
			if(String.isBlank(phone) || phone.trim().length<11){
				return phone;
			}
			return phone.substring(0,3)+"****"+phone.substring(8,11);
		},
		isWeiXin : function() {
		    var a = window.navigator.userAgent.toLowerCase();
		    if (a.match(/MicroMessenger/i) == 'micromessenger') {
		        return true
		    } else {
		        return false
		    }
		},
		getCookie : function(key) {
		    var a = document.cookie.split("; ");
		    for (var i = 0; i < a.length; i++) {
		        if (a[i].split("=")[0] == key) {
		            return (a[i].substring(a[i].indexOf("=") + 1)).replace(/\"/g, "")
		        }
		    }
		    return ''
		},
		// time 毫秒（不填，为session生命周期）
		setCookie : function(key, val, time) {
		    var e = new Date();
		    e.setTime(e.getTime() + time);
		    document.cookie = key + "=" + escape(val) + ";expires=" + e.toGMTString() + ";path=/"
		},
		deleteCookie : function(n) {
		    var d = new Date();
		    d.setTime(d.getTime() - 10000);
		    document.cookie = n + "=v; expires=" + d.toGMTString() + ";path=/"
		},
		// addCSS('#demo{ height: 30px; background:#f00;}');
		addCSS : function (cssText){
		    var style = document.createElement('style'),  //创建一个style元素
		        head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
		    style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
		    if(style.styleSheet){ //IE
		        var func = function(){
		            try{ //防止IE中stylesheet数量超过限制而发生错误
		                style.styleSheet.cssText = cssText;
		            }catch(e){
		            	console.log(e);
		            }
		        }
		        //如果当前styleSheet还不能用，则放到异步中则行
		        if(style.styleSheet.disabled){
		            setTimeout(func,10);
		        }else{
		            func();
		        }
		    }else{ //w3c
		        //w3c浏览器中只要创建文本节点插入到style元素中就行了
		        var textNode = document.createTextNode(cssText);
		        style.appendChild(textNode);
		    }
    		head.appendChild(style); //把创建的style元素插入到head中    
		},
		// dateStr：yyyy-MM-dd HH:mm:ss，兼容IOS 只支持yyyy/MM/dd的格式
		getDate : function(dateStr){
			return new Date(dateStr.replace(/-/g, "/"));
		}
	}

	$.fn.serializeObject = function(){
		var serializeObject = {};
		var array = $(this).serializeArray();
		for(var i=0; i<array.length; i++){
			var obj = array[i];
			serializeObject[obj.name] = obj.value;
		}
		return serializeObject;
	}
	$.extend($, commons); 
})($)

/** validate */
;(function($) {
	var regExp = {
		numbers: /^[0-9]+$/,
		numberOrLetter: /^(?![a-z]+$)(?![A-Z]+$)(?![0-9]+$)[a-zA-Z0-9]+$/,
		chinese: /[\u4E00-\u9FA5]/g,
		email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
		phone: /^1[34578][0-9]{9}$/,
	};
	
	var validate = {
		isNumber : function(val){
			return regExp.numbers.test(val);
		},
		isNumberOrLetter : function(val){
			return regExp.numberOrLetter.test(val);
		},
		isChinese: function(val){
			return regExp.chinese.test(val);
		},
		isEmail: function(val){
			return regExp.email.test(val);
		},
		isPhone: function(val){
			return regExp.phone.test(val);
		}
	}

	$.extend($, validate); 
})($)

/** input set */
;(function($) {
	$('body').delegate('textarea', 'keyup', function() {
		var a = $(this).val();
		var v = a.replace(new RegExp(/<|>|&gt|&lt/g), '');
		if (v != a) {
			$(this).val(v)
		}
	}).delegate('input[type=text]', 'keyup', function() {
		var a = $(this).val();
		var v = a.replace(new RegExp(/(\$|<|>|&|\*|%|\?)/g), '');
		if (v != a) {
			$(this).val(v)
		}
	}).delegate('input[type=tel]', 'keyup', function() {
		var a = $(this).val();
		var v = a.replace(/[^0-9]+/g, '');
		if (v != a) {
			$(this).val(v)
		}
	}).delegate('input[type=number]', 'keyup', function() {
		var $this = $(this);
		var max = parseInt($this.attr("max"));
		var maxlength = parseInt($this.attr("maxlength"));
		if(!isNaN(max) && $this.val()>max){
			$this.val(max);
		}
		if(!isNaN(maxlength)){
			$this.val(($this.val()+"").substr(0,maxlength));
		}
	})
})($)

/** messager **/
;(function($) {
	var messager = {
		subscribe: function(ev, callback) {
			var _callbacks = this._callbacks || (this._callbacks = {});
			(this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
			return this
		},
		publish: function() {
			var args = Array.prototype.slice.call(arguments, 0);
			var ev = args.shift();
			var that = this;
			var calls, list;
			if (!(calls = this._callbacks)) return this;
			if (!(list = this._callbacks[ev])) return this;
			$.each(list, function(k, v) {
				v.apply(that, args)
			});
			return this
		}
	}

	$.extend($, messager);
})($)

/** lazyload */
;(function($) {
	var lazyload = {
		isShow: function($el){
			if(!$el.offset() || $el.offset().top===0 || $el.is(":hidden")){
				return false;
			}
			return $(window).height() + $(window).scrollTop() > $el.offset().top;
		},
		loadImage: function(force) {
			var _self = this;
			var $imgs = $("img[lazyLoad]");
			$imgs.each(function() {
				var $this = $(this);
				if (lazyload.isShow($this) || force) {
					var src = $this.attr("lazyLoad");
					if (src && src.trim()) {
						$this.removeAttr("lazyLoad");
						$this.attr("src", src);
						$this.show()
					}
				}
			})
		},
		initLazyLoad: function() {
			var _self = this;
			_self.loadImage();
			$(window).on("touchmove touchend scroll", function() {
				_self.loadImage()
			});
			_self.bind = true
		}
	};

	$.extend($, lazyload);
})($)

$(function(){
	$.initLazyLoad();
});

/** StateMachine **/
;(function($) {
	var StateMachine = function(){};
	StateMachine.fn  = StateMachine.prototype;
	StateMachine.fn.add = function(controller){
      $(this).bind("change", function(e, current){
        if (controller == current)
          controller.activate();
        else
          controller.deactivate();
      });
      
      controller.active = $.proxy(function(){
        $(this).trigger("change", controller);
      }, this);
    };
    
	$.extend($, {
		CreateStateMachine : function(){
			return new StateMachine();
		}
	});
})($)

/** Toast */
;(function($) {
	
	function initToast(){
		var elToast = '<span style="font-size:1rem;z-index:100000;position:fixed;bottom:10rem;text-align:center;background:rgba(0,0,0,.5);color:white;padding:8px;display:none"></span>';
		var $elToast = $(elToast);
		window.Toast = $elToast;
		$elToast.on("click", function(){
			var event = event || window.event;
		    event.preventDefault();
		    event.stopPropagation();
		});
		window.Toast.appendTo("body");
	}
	
	var Toast = {
		showToast: function(msg, time){
			if(String.isBlank(msg)){
				return;
			}
			if(typeof time === "undefined"){
				time = 1000;
			}
			
			if(!window.Toast){
				initToast();
			}
			
			window.Toast.html(msg);
			window.Toast.css("left",($(window).width()-window.Toast.width())/2);
			window.Toast.fadeIn(100,function(){
				setTimeout(function(){
					window.Toast.fadeOut(500);
				},time);
			});
		}
	};

	$.extend($, Toast);
})($)

/** float-top */
;(function($) {
	var FloatTop = {
		initFloatTop: function(){
			if($elFloatTop){
				return;
			}
			
			var elFloatTop = ''+
				'<div class="float-top">'+
				'	<a href="javascript:void(0);">'+
				'		<div><img src="'+ctx+'../images/top.png" ></div>'+
				'			<span>顶部</span>'+
			    '	</a>'+
				'</div>';
			var $elFloatTop = $(elFloatTop);
			$elFloatTop.appendTo("body");
			window.$elFloatTop = $elFloatTop;
			
			$(window).on("touchmove touchend scroll", function() {
				if($(window).scrollTop()>100){
					$elFloatTop.show();
				}else{
					$elFloatTop.hide();
				}
			});
			
			$elFloatTop.on("click", function(){
				$("html, body").animate({scrollTop: "0px"}, 100);
			})
		}
	};

	$.extend($, FloatTop);
})($)

/** Location */
;(function($) {
	
	var geolocation = null;
	var isInit = false;
	
	
	function initLocation(callFunction){
		$.getScript("http://api.map.baidu.com/getscript?v=2.0&ak="+baiduAk, function(data, textStatus, jqXHR){
			if(textStatus !== "success"){
				console.log("初始化 Location 失败：" + textStatus);
			}else{
				isInit = true;
				if($.isFunction(callFunction)){
					callFunction.call(this);
				}
			}
		});
	}
	
	function initSelectCity(){
		var templ = ''+
		'<div id="divSelectCity" class="popup-mask">'+
		'	<div class="popup-container">'+
		'		<div class="describe">请选择服务城市</div>'+
		'  		{{#data}}'+
		'    		<div class="{{isHighLight}}" data-val="{{cityId}}">{{cityName}}</div>'+
		'  		{{/data}}'+
		'	</div>'+
		'</div>';
		
		
		Mustache.parse(templ);
		
		$.ajaxApi({
			url: ctx + "/api/getServiceCitys",
			type:"get",
			contentType: "application/json",
			dataType: "json",
			async: false,
			data: {},
			success:function(result){
				if(result.code !== 1){
					alert(result.message);
					return;	
				}
				
				if(result.data.length<=1){
					return;
				}
				
				result.isHighLight = function(){
					var serviceCityId = parseInt($.getCookie("serviceCityId"));
					if(this.cityId===serviceCityId){
						return "on";
					}else{
						return "";
					}
				}
				var elSelectCity = Mustache.render(templ, result);
				
				window.SelectCity = $(elSelectCity);
				window.SelectCity.appendTo("body");
				
				$("body").on("click", "#divSelectCity .popup-container>div", function(){
					var $this = $(this);
					if($this.hasClass("on") || $this.hasClass("describe")){
						window.SelectCity.hide();
						return;
					}
					$this.parents("div.popup-container").find("div").each(function(i, n){
						if(i!==0){
							$(this).removeClass("on");
						};
					});
					$this.addClass("on");
					selectedCity($this.data("val"));
					window.SelectCity.hide();
				});
				$("body").on("click", "#divSelectCity", function(){
					window.SelectCity.hide();
				});
			}
		});
	}
	
	function selectedCity(serviceCityId){
		if(serviceCityId !== $.setCookie("serviceCityId")){
			$.setCookie("serviceCityId", serviceCityId, 365*24*60*60*1000);
			$.publish("selectedCity");
		}
	}
	
	var Location = {
		getCurrentPosition: function(callFunction){
			var that = this;
			if(!isInit){
				initLocation(function(){
					that.getCurrentPosition.call(that,callFunction);
				});
				return;
			}
			
			if(!geolocation){
				geolocation = new BMap.Geolocation();
			}
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					var mk = new BMap.Marker(r.point);
					if($.isFunction(callFunction)){
						// {lng: 121.48789949, lat: 31.24916171}
						callFunction.call(that, r.point);
					}
				}else{
					// 定位失败
					$.publish("getCurrentPositionError");
				}
			},{enableHighAccuracy: true})
		},
		initCurrentCity: function(force){
			var that = this;
			
			var currentCityId = $.getCookie("currentCityId");
			var currentCountyId = $.getCookie("currentCountyId");
			
			if(!currentCityId || !currentCountyId || force){
				that.getCurrentPosition(function(point){
					var data = {};
					data.ak = baiduAk;
					data.location = point.lat+","+point.lng;
					data.output = "json";
					data.callback = "getCurrentCity";
					
					$.ajax({
						url: "http://api.map.baidu.com/geocoder/v2/",
						type:"get",
						contentType: "application/json",
						dataType: "jsonp",
			            jsonp: "callback",
			            jsonpCallback:"getCurrentCity",
						data: data,
						success:function(json){
							if(json && json.status===0){
								var adcode = json.result.addressComponent.adcode;
								var currentCityId = adcode.substr(0,4);
								var currentCountyId = adcode;
								$.setCookie("currentCityId", currentCityId);
								$.setCookie("currentCountyId", currentCountyId);
							}
							// 定位当前 市、区 信息成功
							$.publish("initCurrentCity");
						}
					});
				});
			}
		},
		showSelectCity : function(force){
			var serviceCityId = $.getCookie("serviceCityId");
			var currentCityId = $.getCookie("currentCityId");
			
			if(String.isBlank(serviceCityId) && !String.isBlank(currentCityId)){
				selectedCity(currentCityId);
				return;
			}
			
			if(force || (String.isBlank(serviceCityId) && String.isBlank(currentCityId)) || serviceCityId!==currentCityId){
				if(!window.SelectCity){
					initSelectCity();
				}else{
					window.SelectCity.show();
				}
			}
		},
		selectedCity : selectedCity
	};

	$.extend($, Location);
})($)

/** UserTypeSelect */
;(function($) {
	function initUserTypeSelect(){
		if(!userTypes || userTypes.length===0){
			return;
		}
		
		var templ = ''+
		'<div id="divSelectUserType" class="popup-mask">'+
		'	<div class="popup-container">'+
		'		<div class="describe">请选择用户角色</div>';
		for(var i=0; i<userTypes.length; i++){
			templ += '    	<div class="" data-val="'+userTypes[i].code+'">'+userTypes[i].comment+'</div>';
		}
		templ += '	</div>'+
				 '</div>';
		
		window.UserTypeSelect = $(templ);
		window.UserTypeSelect.appendTo("body");
		var userType = $.getCookie("userType");
		window.UserTypeSelect.find('.popup-container>div[data-val="'+userType+'"]').addClass("on");
		
		$("body").on("click", "#divSelectUserType .popup-container>div", function(){
			var $this = $(this);
			if($this.hasClass("on") || $this.hasClass("describe")){
				window.UserTypeSelect.hide();
				return;
			}
			$this.parents("div.popup-container").find("div").each(function(i, n){
				if(i!==0){
					$(this).removeClass("on");
				};
			});
			$this.addClass("on");
			switch ($this.data("val")) {
			case 6:
				window.location.href = ctx+"/wap/toUserCenter?selectUserType=1&time=" + new Date().getTime();
				break;
			case 5:
				window.location.href = ctx+"/wap/jsUser/myCenter?selectUserType=1&time=" + new Date().getTime();
				break;
			case 10:
				window.location.href = ctx+"/wap/myLeader?selectUserType=1&time=" + new Date().getTime();
				break;
			}
			window.UserTypeSelect.hide();
		});
		$("body").on("click", "#divSelectUserType", function(){
			window.UserTypeSelect.hide();
		});
	};
	
	var UserTypeSelect = {
		showUserTypeSelect : function(){
			if(window.UserTypeSelect){
				window.UserTypeSelect.show();
			}else{
				initUserTypeSelect();
				if(window.UserTypeSelect){
					window.UserTypeSelect.show();
				}
			}
		}
	};

	$.extend($, UserTypeSelect);
})($)
if($.getQueryValue("selectUserType")==="1" && $.getCookie("userType")){
	switch ($.getCookie("userType")) {
	case "6":
		$.alert("您已切换到客户端", "阅阳提示");
		break;
	case "5":
		$.alert("您已切换到家护师端", "阅阳提示");
		break;
	case "10":
		$.alert("您已切换到督导端", "阅阳提示");
		break;
	}
}

/** TaskCount */
;(function($) {
	
	function updateTaskCount(){
		$.getApi(ctx + "/api/getTaskCount?once=" + new Date().getTime(), function(result){
			if(result && result.data && result.data>0){
				$.addCSS('.bottom-btn-bar .weui_tabbar_item .weui_tabbar_icon.task_list:before{content:"'+result.data+'";display:block;font-size:10px;line-height:1pc;text-align:center;color:#fff;background:red;width:15px;height:15px;border-radius:50%;right:-10px;top:-5px;position:absolute}')
				$.addCSS('.bottom-btn-bar .weui_tabbar_item.weui_bar_item_on .weui_tabbar_icon.task_list:before{content:"'+result.data+'";display:block;font-size:10px;line-height:1pc;text-align:center;color:#fff;background:red;width:15px;height:15px;border-radius:50%;right:-10px;top:-5px;position:absolute}')
			}
		})
	}
	
	var TaskNotifier = {
		initTaskNotifier: function(){
			updateTaskCount();
			setInterval(updateTaskCount, 1000 * 60 * 5);//1000为1秒钟
		},
		updateTaskCount: updateTaskCount
	};

	$.extend($, TaskNotifier);
})($)

/** weiuiPlug */
;(function($) {
	
	var weiuiPlugProperty = {
		
		// 按钮是否失效
		isBtnDisabled: function(){
			return $(this).hasClass("weui_btn_disabled");
		},
	};

	$.extend($.fn, weiuiPlugProperty);
})($)
