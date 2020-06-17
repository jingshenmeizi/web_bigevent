$(function() {
    // 获取用户信息
    getUserInfo();
    // 退出登录
    signOut();
})
var layer = layui.layer;

function signOut() {
    $("#logout").on("click", function() {
        // 弹出确认退出提升框
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //清空token
            localStorage.removeItem('token');
            //跳转到登录页面
            location.href = '/login.html';
            //关闭弹框
            layer.close(index);
        });
    })
}

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
                return layer.msg("获取用户信息失败");
            }
            // 渲染头像和名称
            renderHeadImg(res.data);
        }

    })
}

function renderHeadImg(data) {
    var name = data.nickname || data.username;
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