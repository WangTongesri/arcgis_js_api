
function ajaxfunc (url,type,restData,callback) {
    $.ajax({
        url: url,
        type: type,
        data: restData,
        timeout: 3600000,
        cache: false,
        async: false,
        dataType: 'json',
        success: function (res) {
            callback(res);
        },
        error: function (res) {
            callback(res);
        }
    });
};

// token
var portal_url="https://portal106.arcgisonline.cn/arcgis/";
var GA_url="https://ga106.arcgisonline.cn/arcgis/rest/services/System/GeoAnalyticsTools/GPServer/";
var token_url=portal_url+"sharing/rest/generateToken";
var portal_tokenData = {
    username: 'arcgis', //portal用户名
    password: 'esri1234', //portal密码
    client: 'referer',
    referer: GA_url,
    expiration: '60',
    f: 'pjson'
};

//要素页面查询
var query_func=function(url,fields,token,callback){
    var query_tokendata={
        where:"1=1",
        outFields:fields,
        returnGeometry:false,
        f: 'json',
        token:token
    }
    ajaxfunc(url,'POST',query_tokendata,function(res){
        callback(res);
    })
}

// join分析
function join_func(data1,data2,outputname,context,token,callback){
    var url=GA_url+'JoinFeatures/submitJob';
    var rest_data={
        targetLayer: '{"url":"'+data1+'"}',
        joinLayer:  '{"url":"'+data2+'"}',
        JoinOperation:"JoinOneToMany",
        spatialRelationship:"Intersects",
        //summaryFields:'[]',
        outputName:"join_output"+outputname+new Date().getTime(),
        context:context,
        f: 'json',
        token: token


    }
    var clock=null;
    ajaxfunc(url, 'POST', rest_data, function (res) {
        var jobId = res.jobId;
        clock =  window.setInterval(function () { re(jobId)}, 2000);
    })
    var re = function(jobId) {
        var joburl = GA_url + "JoinFeatures/jobs/" + jobId;
        var data = {
            f: 'json',
            token: token
        };
        ajaxfunc(joburl, 'POST', data, function (res) {
            var jobStatus = res.jobStatus;
            if (jobStatus == 'esriJobSubmitted' || jobStatus == 'esriJobWaiting' || jobStatus == 'esriJobExecuting') {
                console.log(jobStatus);
            }
            if (jobStatus == 'esriJobFailed' || jobStatus == 'esriJobTimedOut' || jobStatus == 'esriJobCancelling' || jobStatus == 'esriJobCancelled') {
                console.log(res.messages);
                window.clearInterval(clock);
                callback('');

            }
            if (jobStatus == 'esriJobSucceeded') {
                //var output = joburl + '/results/output';
                window.clearInterval(clock);
                ajaxfunc(joburl + '/results/output','POST',data,function (res) {
                    if(res.value.url!=undefined){
                        var resultOutput=res.value.url;
                        callback(resultOutput);
                    }else{
                        console.log("JoinFeatures输出结果为空")
                        callback("");
                    }
                })
            }
        })
    }
}

// Summarize Attributes 分析
function SumAtt_func(data1,fields,context,token,callback){
    var url=GA_url+'SummarizeAttributes/submitJob';
    var rest_data={
        inputLayer: '{"url":"'+data1+'"}',
        fields:fields,
        summaryFields:'[]',
        outputName: 'SumAtt_ouput'+new Date().getTime(),
        context:context,
        f: 'json',
        token: token
    }
    var clock=null;
    ajaxfunc(url, 'POST', rest_data, function (res) {
        var jobId = res.jobId;
        clock =  window.setInterval(function () { re(jobId)}, 2000);
    })
    var re = function(jobId) {
        var joburl = GA_url + "SummarizeAttributes/jobs/" + jobId;
        var data = {
            f: 'json',
            token: token
        };
        ajaxfunc(joburl, 'POST', data, function (res) {
            var jobStatus = res.jobStatus;
            if (jobStatus == 'esriJobSubmitted' || jobStatus == 'esriJobWaiting' || jobStatus == 'esriJobExecuting') {
                console.log(jobStatus);
            }
            if (jobStatus == 'esriJobFailed' || jobStatus == 'esriJobTimedOut' || jobStatus == 'esriJobCancelling' || jobStatus == 'esriJobCancelled') {
                console.log(res.messages);
                window.clearInterval(clock);
                callback("")
            }
            if (jobStatus == 'esriJobSucceeded') {
                var output = joburl + '/results/output';
                window.clearInterval(clock);
                ajaxfunc(output,'POST',data,function (res) {
                    var resultOutput = res.value.url;
                    callback(resultOutput);
                })
            }
        })
    }
}

//X公里格网点聚合分析
function AggPoints_func(data1,num,context,token,callback){
    var url=GA_url+'AggregatePoints/submitJob';
    var rest_data={
        pointLayer: '{"url":"'+data1+'"}',
        binType:"Hexagon",
        binSize:num,
        binSizeUnit:"Kilometers",
        polygonLayer:"",
        outputName: 'AggPoints_ouput'+new Date().getTime(),
        context:context,
        f: 'json',
        token: token
    }
    var clock=null;
    ajaxfunc(url, 'POST', rest_data, function (res) {
        var jobId = res.jobId;
        clock =  window.setInterval(function () { re(jobId)}, 2000);
    })
    var re = function(jobId) {
        var joburl = GA_url + "AggregatePoints/jobs/" + jobId;
        var data = {
            f: 'json',
            token: token
        };
        ajaxfunc(joburl, 'POST', data, function (res) {
            var jobStatus = res.jobStatus;
            if (jobStatus == 'esriJobSubmitted' || jobStatus == 'esriJobWaiting' || jobStatus == 'esriJobExecuting') {
                console.log(jobStatus);
            }
            if (jobStatus == 'esriJobFailed' || jobStatus == 'esriJobTimedOut' || jobStatus == 'esriJobCancelling' || jobStatus == 'esriJobCancelled') {
                console.log(res.messages);
                window.clearInterval(clock);
                callback("")
            }
            if (jobStatus == 'esriJobSucceeded') {
                var output = joburl + '/results/output';
                window.clearInterval(clock);
                ajaxfunc(output,'POST',data,function (res) {
                    var resultOutput = res.value.url;
                    callback(resultOutput);
                })
            }
        })
    }
}
