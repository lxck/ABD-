$(function(){function t(){var t=0,a=0,n=0;$("input[name='checkbox[]']:checked").each(function(){var e=$(this).parents("li"),i=e.find(".j-rcPrice").val(),c=e.find(".j-rcNum").val();c||(c=0);var r=i*c,s=i*c;t+=parseFloat(r),a+=parseFloat(s),n+=parseFloat(c)}),$("#j-resultTotal").text(t.toFixed(2)),$("#j-resultTotal-origin").text(a.toFixed(2)),$(".j-totalNum").text(parseFloat(n)),e(".mcart_pay")}function e(t){$(t).each(function(){var t=$(this),e=t.find(".nums").text(),a=e.split(".");t.find(".integer").text(a[0]+"."),t.find(".decimal").text(a[1]),t.find(".nums").hide()})}$(".J-quanx").on("click",/*原来为touchend*/function(){var e=$(this),a=e.find("b"),n=e.siblings(".j-ip-selectAll"),i=$(".J-inp"),c=i.find("em"),r=i.siblings("input[name='checkbox[]']");a.hasClass("cur")?(a.removeClass("cur"),n.attr("checked",!1),c.removeClass("cur"),r.attr("checked",!1)):(a.addClass("cur"),n.attr("checked",!0),c.addClass("cur"),r.attr("checked",!0)),t()}),$(".J-inp").on("click",/*原来为touchend*/function(){var e=$(this),a=e.find("em"),n=e.siblings("input[name='checkbox[]']");a.hasClass("cur")?(a.removeClass("cur"),n.attr("checked",!1)):(a.addClass("cur"),n.attr("checked",!0)),$(".J-inp em.cur").length==$(".J-inp em").length?($(".J-quanx b").addClass("cur"),$(".j-ip-selectAll").attr("checked",!0)):($(".J-quanx b").removeClass("cur"),$(".j-ip-selectAll").attr("checked",!1)),t()}),$("input[name='checkbox[]']").each(function(){var t=$(this);t.is(":checked")||t.siblings(".J-inp").find("em").removeClass("cur")}),$(".del-item").click(function(){var e=[],a=$('input[name="checkbox[]"]:checked');return a.each(function(){e.push($(this).val())}),e.length?void $.aLert({title:"确定删除？",clickOK:function(){$.post("/Item/del",{id:e},function(e){1==e.status&&a.parents("li.g-box").fadeOut(300,function(){$(this).remove(),t(),$(".mcart_goods li").length||window.location.reload()})})}}):void $.Error("请选择要删除的商品")}),$("#buyer").click(function(){var t=[],e=$('input[name="checkbox[]"]:checked'),a=[],n=[],i=[];e.each(function(){var e=$(this).parents("li");t.push(e.find(".j-rcNum").val()),i.push(e.find(".j-rcSku").val()),n.push(e.find(".j-rcActive").val()),a.push(e.find("input[name=is_need_subscribe]").val())}),-1==$.inArray("1",a)?($('input[name="num"]').val(t),$('input[name="sku_id"]').val(i),$('input[name="active"]').val(n),$("#form1").submit()):$("#show_qrcode").show()});var a=$("#j-xgVal").val();if(a.length)var n=$.parseJSON(a);$(document).on("click",/*原来为touchStart*/".edd",function(){var e=$(this).parent().children(".j-rcNum").val();e>1?$(this).parent().children(".j-rcNum").val(e-1):$(this).parent().children(".j-rcNum").val(1),t()}),$(document).on("click",/*原来为touchStart*/".add",function(){var e=$(this).parent().children(".j-rcNum").val();$(this).parent().children(".j-rcNum").val(parseInt(e)+1),$(".j-rcNum").keyup(),t()}),$(".j-rcNum").keyup(function(){var e=$(this).data("id"),a=($(this).val(),n[e]);nowNum=0,$(".j-rcNum[data-id="+e+"]").each(function(){var t=$(this).val();nowNum+=parseInt(t)}),0!=a&&parseInt(nowNum)>parseInt(a)&&($.Error("您所输入的数量已超过限购数量"),$(this).val("1")),t()}),t(),_QV_="%E6%9D%AD%E5%B7%9E%E5%90%AF%E5%8D%9A%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E7%89%88%E6%9D%83%E6%89%80%E6%9C%89",$(".qkbtn").click(function(){var t=[];$(".outxiao").each(function(){t.push($(this).data("id"))}),$.ajax({url:"/Item/clearFail",type:"post",dataType:"json",data:{ids:t},success:function(t){1==t.status?$.Error("恭喜，操作成功！"):$.Error("抱歉，操作失败！"),setTimeout(function(){window.location.reload()},300)}})}),e(".mcart_goods ul li");var i=$(".nav .inner").outerHeight();$(".mcart_pay").css({bottom:i})});