$("#btn_submit").click(function(){
    //获取要分析的数据
    var target=$("#target_name").attr("data-value");
    var join=$("#join_name").attr("data-value");

    /*---------执行GA分析流程---------
    ************   1.获取token
    ************   2.执行join分析
    * **********   3.执行Summarize Attributes分析
    *
    */
    ajaxfunc(token_url, 'POST', portal_tokenData, function (res_token) {
        var token = res_token.token;
        console.log("GAtoken:"+token);

        join_func(target,join,'join','',token,function(res_url) {
            var result=res_url;
            console.log("Join分析结果地址:"+result);
            if(result!=''){
                SumAtt_func(result,'dlbm','',token,function(res_data){
                    console.log("Summarize Attributes分析结果地址:"+res_data);
                    alert("执行成功");
                })
            }

        })
    })

})