$(function () {
    $('.del').click(function (e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-'+id);

        $.ajax({
            type:'DELETE',
            url:'/admin/list?id=' + id
        })
        .done(function (results) {     //服务器返回的一个状态
            if(results.success ===1){
                if(tr.length>0){
                    tr.remove()
                }
            }
        })
    })
});