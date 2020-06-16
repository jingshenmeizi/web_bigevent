$(function() {
    getUserInfo();
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // // 请求头
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败");
            }
            // 渲染头像和名称
            renderHeadImg(res.data);
        }
    })
}

function renderHeadImg(data) {
    var name = data.resnickname || data.username;

    $(".welcome").html('欢迎&nbsp&nbsp' + name);
    // 头像
    if (data.user_pic !== null && data.user_pic !== "") {
        // 有头像
        $(".head-txt").hide();
        $(".layui-nav-img").attr('src', data.user_pic).show();

    } else {
        // 没有头像
        $(".layui-nav-img").hide();
        $(".head-txt").html(name[0].toUpperCase()).show();
    }
}