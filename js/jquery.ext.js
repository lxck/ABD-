function myAjax(_data, _url, callBack) { //把原本的ajax封装一下，下次调用直接传地址，参数，回调就行了
    $.ajax({
        type: "post",
        url: _url,
        data: _data,
        cache: false,
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (callBack != undefined) {
                callBack(data);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("错误：" + errorThrown);
        }
    });
}
