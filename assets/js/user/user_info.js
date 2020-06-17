$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度为1-6个字符！'
            }
        }
    });
    // 初始化用户信息
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('获取用户信息失败！')
                }
                form.val("formUserInfo", res.data)
            }
        })
    }
    // 重置
    $("#resetbtn").on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    });
    // 更新用户信息
    $("#formUserInfo").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                    // 重新渲染父容易中的个人信息
                window.parent.getUserInfo();
            }
        })
    })
})