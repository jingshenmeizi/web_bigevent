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
    })
})