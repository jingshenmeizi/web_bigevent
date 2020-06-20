$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var isEdit = false;
    initSelectCate();
    // 初始化富文本编辑器
    initEditor()
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    //更换裁剪区域图片
    $("#selectFaceBtn").on("click", function(e) {
        $("#face").click();
    })
    $("#face").on("change", function(e) {
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    var editData = null;
    //如果是编辑跳过来的，则需要渲染数据
    if (localStorage.getItem("editData")) {
        isEdit = true;
        editData = JSON.parse(localStorage.getItem("editData"));
        $("[name=title]").val(editData.title);
        // 根据类别id获得类型名称
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + editData.cate_id,
            success: function(res) {
                console.log(res);
                if (res.status === 0) {
                    $("[name=cate_id]").val(res.data.name);
                    form.render()
                }
            }
        })
        $("[name=content]").val(editData.content);
        localStorage.removeItem("editData");
    }

    // 准备数据
    var state = "已发布";
    $("#saveBtn").on("click", function() {
        state = "草稿"
    });
    $("#form_pub").on("submit", function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append("state", state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);
                pubArt(fd)
            })
    })

    function pubArt(fd) {
        // 是否是编辑
        if (isEdit) {
            fd.append("Id", editData.Id)
            fd.forEach(function(e, i) {
                console.log(i, e);
            })
            $.ajax({
                method: "POST",
                url: "/my/article/edit",
                data: fd,
                //如果向服务器提交的是FormData格式的数据，必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg("修改文章失败！")
                    }
                    layer.msg("修改文章成功！");
                    location.href = "/article/art_list.html";
                }
            })
        } else {
            $.ajax({
                method: "POST",
                url: "/my/article/add",
                data: fd,
                //如果向服务器提交的是FormData格式的数据，必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg("发布文章失败！")
                    }
                    layer.msg("发布文章失败！");
                    location.href = "/article/art_list.html";
                }
            })
        }

    }

    function initSelectCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("获取文章类别失败！")
                }
                // 渲染下拉框
                var htmlStr = template("select_cate", res);
                $("[name=cate_id]").html(htmlStr);
                //下拉框必须调用layui以下方法去重新渲染
                form.render();
            }
        })
    }
})