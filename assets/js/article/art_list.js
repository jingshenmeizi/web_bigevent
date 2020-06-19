$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！")
                }
                // 渲染表格
                var htmlStr = template("art_table", res);
                $("#art_lists").html(htmlStr);
            }
        })
    }
})