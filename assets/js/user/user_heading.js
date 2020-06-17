$(function() { 
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);
    // 上传头像
    $("#uploadHeadImg").on('click', function() {
        $("#fileImg").click();
    });
    // 更换裁剪区域图像
    $("#fileImg").on('change', function(e) {
        // e事件中的target中的files属性可以拿到上传的文件列表
        var file = e.target.files[0];
        //创建新的url地址
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 更新头像

    $("#submitHeadImg").on('click', function() {

        var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        console.log(dataURL);

        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("更换头像失败！");
                }
                layer.msg("更换头像成功！");
                window.parent.getUserInfo();
            }
        })
    })

})