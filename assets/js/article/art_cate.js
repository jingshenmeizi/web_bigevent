$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("获取文章列表失败！");
                }
                // 渲染列表
                var listStr = template("artCateLsit", res);
                $("#cateItems").html(listStr)
            }
        })
    }
    var addIndex = null;
    // 添加类别弹出层
    $("#addCate").on("click", function() {
        addIndex = layer.open({
            // 页面层
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-add").html()
        });
    });
    // 提交添加的类型
    $("body").on('submit', '#form-addCate', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("添加文章类别失败！")
                }
                layer.msg("添加文章类别成功！")
                initArtCateList();
                layer.close(addIndex);
            }
        })
    });
    // 给编辑按钮绑定事件
    var editIndex = null;
    $("#cateItems").on('click', '.btnEdit', function() {
        editIndex = layer.open({
            // 页面层
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-edit").html()
        });
        var id = $(this).attr('data-id');
        // 发起请求
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("获取文章类别失败！")
                }
                // 渲染表格
                form.val('editData', res.data);
            }
        })

    });
    // 更新文章类型
    $("body").on('submit', "#form-editCate", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("更新文章类别失败！")
                }
                initArtCateList();
                layer.close(editIndex);
            }
        })
    });
    // 删除类别
    $("#cateItems").on('click', '.btnDel', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
            // 发起请求
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg("删除失败！")
                        return layer.close(index);
                    }
                    layer.msg("删除成功！")
                    layer.close(index);
                    // 渲染表格
                    initArtCateList();
                }
            })
        });
    })
})