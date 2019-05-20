/**
 * 获取商品信息
 * @param wareId 商品ID
 * @param async  是否同步，默认为同步
 * @returns {*}
 */
function loadWareById(wareId,async){
    return ajax(ctx+"/api/getWareDetail",{wareId:wareId},async);
}
/**
 * 获取商品列表
 * @param queryData  查询条件json obj
 * @param async     是否同步，默认为同步
 * @returns {*}
 */
function loadWareList(queryData,async){
    return ajax(ctx+"/api/wareList",queryData,async);
}
/**
 * 获取订单列表
 * @param queryData 查询条件json obj
 * @param async 是否同步，默认为同步
 * @returns {*}
 */
function loadOrderList(queryData,async){
    return ajax(ctx+"/api/getOrderList",queryData,async);
}

function loadOrderById(orderId,async){
    return ajax(ctx+"/api/getOrderDetail",{orderId:orderId},async);
}

/**
 * 封装ajax
 * @param url  请求url
 * @param queryData  data；
 * @param async 异步 默认为同步
 * @param type  请求类型  默认post
 * @returns {*}
 */
function ajax(url,queryData,async,type){
    if(async==undefined||async==null||async==''){
        async=false;
    }
    if(type==undefined||type==null||type==''){
        type="POST";
    }
    var result;
    $.ajax({
        url:url,
        type:type,
        async:async,
        dataType:"json",
        data:queryData,
        success:function(data){
            console.info(data);
            if(data.success){
                result=data.data;
            }else if(data.code==-1){//未登录
                location.href=ctx+"/wap/login"
            }
        }
    });
    return result;
}

/**
 * 封装ajax
 * @param url  请求url
 * @param queryData  data；
 * @param async 异步 默认为同步
 * @param type  请求类型  默认post
 * @returns {*}
 */
function ajax2(url,queryData,async,type){
    if(async==undefined||async==null||async==''){
        async=false;
    }
    if(type==undefined||type==null||type==''){
        type="POST";
    }
    var result;
    $.ajax({
        url:url,
        type:type,
        async:async,
        dataType:"json",
        data:queryData,
        success:function(data){
            console.info(data);
            result = data.code;
        }
    });
    return result;
}