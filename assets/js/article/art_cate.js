$(function() {
    var layer = layui.layer;
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
    })
})