$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //时间补0
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }
    // 时间格式化过滤函数
    template.defaults.imports.timeFormat = function(time) {
        var date = new Date(time);
        var y = padZero(date.getFullYear());
        var m = padZero(date.getMonth());
        var d = padZero(date.getDay());
        var hh = padZero(date.getHours());
        var mm = padZero(date.getMinutes());
        var ss = padZero(date.getSeconds());
        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    };
    //  初始化表格
    initTable();
    //初始化下拉框
    initAllCate();
    //筛选功能
    $("#form_select").on('submit', function(e) {
        e.preventDefault();
        // 获取表单的值
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();

    })

    function initAllCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("获取文章类别失败！")
                }
                // 渲染下拉框
                var htmlStr = template("all_cate", res);
                $("[name=cate_id]").html(htmlStr);
                //下拉框必须调用layui以下方法去重新渲染
                form.render();
            }
        })
    }

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
                //渲染分页
                renderPage(res.total);
            }
        })
    }

    function renderPage(total) {
        layui.use('laypage', function() {
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: q.pagesize, //每页显示的条数
                curr: q.pagenum,
                limits: [2, 3, 5, 10],
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                //切换分页的回调
                jump: function(obj, first) {
                    //obj包含了当前分页的所有参数
                    q.pagenum = obj.curr; //得到当前页，以便向服务端请求对应页的数据。
                    q.pagesize = obj.limit;
                    //首次不执行
                    if (!first) {
                        initTable()
                    }
                }
            });
        });
    }
    // 删除功能

    $("#art_lists").on('click', '.btn-del', function() {
        var id = $(this).attr('data-id');
        var lens = $(".btn-del").length;
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg("删除失败！")
                    }
                    layer.msg("删除成功！")
                    q.pagenum = lens === 1 ? q.pagenum - 1 : q.pagenum;
                    initTable()
                }
            })
            layer.close(index);
        });
    })

    // 编辑功能

    $("#art_lists").on('click', '.btn-edit', function() {
        var id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function(res) {
                var editJson = JSON.stringify(res.data);
                if (res.status !== 0) {
                    layer.msg("获取文章信息失败！")
                }
                // 跳转html
                location.href = "/article/art_pub.html";
                // 传值
                window.localStorage.setItem('editData', editJson)
            }
        });

    })
})