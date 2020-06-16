$(function() {
    // 点击去注册
    $("#link_reg").on("click", function() {
        $(".reg-box").show();
        $(".login-box").hide();
    });
    //点击去登录
    $("#link_login").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide();
    });
    // 自定义form校验规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 密码校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码校验规则
        repwd: function(value) {
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });
    // 注册功能
    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        };
        $.post("/api/reguser", data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功，请登录！");
            $("#link_login").click();
        });
    });
    // 登录
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            data: $(this).serialize(),
            method: "POST",
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("登录失败");
                }
                // 将token值存起来
                localStorage.setItem('token', res.token);
                layer.msg("登录成功");
                location.href = "/index.html";
            }
        })
    })
})