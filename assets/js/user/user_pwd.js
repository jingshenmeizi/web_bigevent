$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $("[name=oldPwd]").val()) {
                return '新旧密码不能一样！'
            }
        },
        rePwd: function(value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码输入不一致！'
            }
        }
    });
    //重置密码
    $("#formUserPwd").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('修改密码失败！');
                }
                layer.msg('修改密码成功！');
                // 重置表单
                $("#formUserPwd")[0].reset()
            }
        })
    })
})