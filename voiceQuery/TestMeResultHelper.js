'use strict';

(function (){

 
    var co = require('co');
    var assert = require('assert');
    
    
    let driverStr='mongodb://localhost:27017/gzzf_testme';
    let Mongo=require('mongodb').MongoClient;
       
    co(function* (){
        let collecitonName='testme';
        let runName=require('./config/Config').runName;
        console.log("测试名称:"+runName);
        
        let db = yield Mongo.connect(driverStr);
        let each=require('../Iterator').each;
        
        var r1= yield db.collection(collecitonName).count({catalog:runName});
        console.log("总记录次数:"+r1);
        var r2= yield db.collection(collecitonName).count({catalog:runName,err:0});
        console.log("总成功次数:"+r2);
        var r3= yield db.collection(collecitonName).count({catalog:runName,ret:/超时/});
        console.log("语音分析以及查询后台返回超时结果次数:"+r3);
        db.close();
        
        
        Mongo.connect(driverStr, function(err, db){
            if (err) {
                return;
            }
            showDetail(db,r1,r2);
        });
    }).catch(function(err) {
        console.log(err.stack);
    });;
    

})();
    
    
function showDetail(db,totalNum,sucNum){
        let collecitonName='testme';
        let runName=require('./config/Config').runName;
        
        db.collection(collecitonName).find({catalog:runName},function(err,results){
            if(err){  
                console.log("collection find error");  
                return;  
            }
            if (true) {
                var totalAskTimes=0;//总轮训次数
                var firstStepTotalTime=0;//第一步完成的总耗时
                var totalTimes=0;//完成请求的总耗时
                var s1=0;
                var s2=0;
                var s3=0;
                var s4=0;
                var s5=0;
                var s6=0;
                var s0=0;
                //let timeout=0;
                var min=0;
                var max=0;
                var count=0;
                results.forEach(function(doc){
                    if (min==0||min>doc.z_endQuerySpend) {
                        min=doc.z_endQuerySpend;
                    }
                    if (max<doc.z_endQuerySpend) {
                        max=doc.z_endQuerySpend;
                    }
                    totalAskTimes+=doc.askTimes;
                    firstStepTotalTime+=doc.z_enterWaitingAnswerSpend;
                    totalTimes+=doc.z_endQuerySpend;
                    //if (arr[i].ret.indexOf("超时")>-1) {
                    //    timeout++;
                    //}
                    switch (doc.step){
                        case 0:
                            s0++;
                        break;
                        case 1:
                            s1++;
                        break;
                        case 2:
                            s2++;
                        break;
                        case 3:
                            s3++;
                        break;
                        case 4:
                            s4++;
                        break;
                        case 5:
                            s5++;
                        break;
                        case 6:
                            s6++
                        break;
                    }
                    //count++;
                    //console.log((++count)+" "+totalNum);
                    if ((++count)==totalNum) {
                        db.close();
                        console.log("总轮询次数:"+totalAskTimes+",平均次数:"+(totalAskTimes/totalNum));
                        //第一次请求为1，第一次请求成功回调2 ，第一次请求error 3，第二次请求执行4 ，第二次成功5，第二次error6
                        console.log("初始状态次数:"+s0);
                        console.log("第一次请求次数:"+s1);
                        console.log("第一次请求成功次数:"+s2);
                        console.log("第一次请求error次数:"+s3);
                        console.log("第二次请求次数:"+s4);
                        console.log("第二次请求成次数:"+s5);
                        console.log("第二次请求error次数:"+s6);
                        
                        console.log("-------------时间单位：毫秒");
                        console.log("第一步完成的总耗时:"+firstStepTotalTime+",平均耗时"+(firstStepTotalTime/totalNum));
                        console.log("完成的总耗时:"+totalTimes+",平均耗时"+(totalTimes/totalNum));
                        console.log("最小耗时:"+min+",最大耗时"+max);
                        console.log("平均周期:"+((totalTimes/totalNum)/(totalAskTimes/totalNum)))
                    }
                });            
                return;
            }
            /*
            results.toArray(function(err,arr){
     
    
                if(err){  
                    let each=require('../Iterator').each;
                    each("","",err)
                    return;  
                }  
                for(var i in arr){
                    if (min==0||min>arr[i].z_endQuerySpend) {
                        min=arr[i].z_endQuerySpend;
                    }
                    if (max<arr[i].z_endQuerySpend) {
                        max=arr[i].z_endQuerySpend;
                    }
                    totalAskTimes+=arr[i].askTimes;
                    firstStepTotalTime+=arr[i].z_enterWaitingAnswerSpend;
                    totalTimes+=arr[i].z_endQuerySpend;
                    //if (arr[i].ret.indexOf("超时")>-1) {
                    //    timeout++;
                    //}
                    switch (arr[i].step){
                        case 0:
                            s0++;
                        break;
                        case 1:
                            s1++;
                        break;
                        case 2:
                            s2++;
                        break;
                        case 3:
                            s3++;
                        break;
                        case 4:
                            s4++;
                        break;
                        case 5:
                            s5++;
                        break;
                        case 6:
                            s6++
                        break;
                    }
                }
              console.log("总轮询次数:"+totalAskTimes+",平均次数:"+(totalAskTimes/totalNum));
              //第一次请求为1，第一次请求成功回调2 ，第一次请求error 3，第二次请求执行4 ，第二次成功5，第二次error6
              console.log("初始状态次数:"+s0);
              console.log("第一次请求次数:"+s1);
              console.log("第一次请求成功次数:"+s2);
              console.log("第一次请求error次数:"+s3);
              console.log("第二次请求次数:"+s4);
              console.log("第二次请求成次数:"+s5);
              console.log("第二次请求error次数:"+s6);
              
              console.log("-------------时间单位：毫秒");
              console.log("第一步完成的总耗时:"+firstStepTotalTime+",平均耗时"+(firstStepTotalTime/totalNum));
              console.log("完成的总耗时:"+totalTimes+",平均耗时"+(totalTimes/totalNum));
              console.log("最小耗时:"+min+",最大耗时"+max);
              console.log("平均周期:"+((totalTimes/totalNum)/(totalAskTimes/totalNum)))
              //console.log("语音分析以及查询后台返回超时结果次数:"+timeout);
            });
      
        db.close();*/
    });
}