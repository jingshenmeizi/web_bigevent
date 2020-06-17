$(function() {
    //在调用ajax之前都会先调用 ajaxPrefilter ，并且能够拿到我们给ajax配置的对象
    $.ajaxPrefilter(function(option) {
        // 在发起真正发起ajax时，统一拼接根路径
        option.url = "http://ajax.frontend.itheima.net" + option.url;
        //统一为有权限限制的接口设置请求头
        if (option.url.indexOf("/my/") !== -1) {
            option.headers = {
                Authorization: localStorage.getItem('token')
            }
        }
        // 无论ajax请求是成功失败都会调用complete
        option.complete = function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = '/login.html';
            }
        }
    })
})