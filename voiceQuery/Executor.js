"use strict"

let Mongo=require('mongodb').MongoClient;
let _event=require('events');
let _util = require("util");
let _http=require('http');
let _fs=require('fs');
let _schedule=require('node-schedule');
//
let Record=require("./Record");
let Config=require("./config/Config");

function Executor(_id,_sid,_fileIndex) {
    this.id=_id;
    this.sid=_sid;
    
    this.record=new Record(Config.runName);
    
    this.record.startTime=new Date().getTime();
    this.record.id=this.id;
    this.record.sid=this.sid;
    this.record.fileIndex=_fileIndex;
}

/**
 *这个就是请求的第一步 ，让后台去下语音文件，这个上传的是文件id
 */
Executor.prototype.firstHttp=function(){
    var _this=this;
    this.record.step=1;
    this.httpPost("127.0.0.1","8080","/aaa/uploadVoice",{"sid":_this.sid,"fileIndex":_this.record.fileIndex},function(feedBack){
        if(feedBack.statusCode==200){
            var response=''
            feedBack.on('data', function (data) {
                response+=data;
            });
            feedBack.on('end', function () {
                //第一次交互完毕
                _this.record.enterWaitingAnswerTime=new Date().getTime();
                console.log("1 response:"+response);
                _this.record.reqId=response;
                _this.record.askTimes=1;
                Config.allProps(_this.record);
                console.log(_this.record.enterWaitingAnswerTime-_this.record.startTime);
                
                //
                _this.record.step=2;
                _this.record.askTimes=1;
                //第0次查询结果（实际上让服务端通知ai后台来拿文件，所以不需要延迟）
                _this.SecondHttp(response,"firstHttp");
            });
        }
    });
}

/**
 *第二步，查询结果
 */
Executor.prototype.SecondHttp=function(firstResult,_who){
    if (firstResult==undefined) {
        return;
    }
    var _this=this;
    console.log("\nsecond:"+firstResult+"by whom:"+_who);
    var value=firstResult.split("=")[1];
    _this.record.step=4;
    this.httpPost("127.0.0.1","8080","/aaa/checkVoiceResult",{"requestId":value},function(feedBack){
        if(feedBack.statusCode==200){
            var response=''
            feedBack.on('data', function (data) {
                response+=data;
            });
            feedBack.on('end', function () {
                //console.log("2 response:"+response);
                if (response.indexOf('requestId')>-1) {
                    var rule = new _schedule.RecurrenceRule();

                    var times=null;
                    if (_this.record.askTimes!=1) {
                        _this.record.askTimes=_this.record.askTimes+1;
                        var s=new Date().getSeconds();
                        times = [s+2>=60?(2-(60-s+1)):s+2];
                    }else {//如果是第一次访问查询结果接口，要根据文件长度来判定延迟
                        _this.record.askTimes=_this.record.askTimes+1;
                        if (_this.record.fileIndex==0) {
                            var s=new Date().getSeconds();
                            times = [s+5>=60?(5-(60-s+1)):s+5];
                        }else if (_this.record.fileIndex==1) {
                            var s=new Date().getSeconds();
                            times = [s+7>=60?(7-(60-s+1)):s+7];
                        } else if (_this.record.fileIndex==2) {
                            var s=new Date().getSeconds();
                            times = [s+9>=60?(9-(60-s+1)):s+9];
                        }else if (_this.record.fileIndex==3) {
                            var s=new Date().getSeconds();
                            times = [s+11>=60?(11-(60-s+1)):s+11];
                        }
                        console.log(times);
                    }
                    rule.second = times;
                    
                    var j=new _schedule.scheduleJob(rule, function(){
                        //console.log("3 response:"+response);
                        _this.SecondHttp(firstResult,"self");
                        j.cancel();
                    });
                }else{
                    var ret = response.substring(response.indexOf("checkVoiceResult=suc,") + 21);
                    ret = decodeURIComponent(decodeURI(ret));
                    //console.log("4 response: "+ret);
                    _this.record.step=5;
                    _this.record.err=0;
                    _this.end(ret);
                }
            });
        }
    });
}

//-----------------
Executor.prototype.httpPost=function(_host,_port,_path,_data,_function) {
    var _this=this;
    if (_data==undefined) {
        _data= {  
        };  
    }
   
    var querystring = require('querystring');
    var httpdata=querystring.stringify(_data);
    
    //console.log(httpdata);
    
    var http = require('http');
    var opt = {  
            method: "POST",  
            host: _host,  
            port: _port,  
            path: _path,
            headers: {   
                'Content-Type':"application/x-www-form-urlencoded",
                "Content-Length": httpdata.length  
            }  
    };  
    var req = http.request(opt, function (serverFeedback) {  
            //consloe.log(serverFeedback.statusCode);return;
            _function.call(0,serverFeedback);
        }).on('error', function(e) {
            console.log("Got error: " + e.message+"...requestid:"+_this.record.reqId);
            
                if (_this.record.reqId!=undefined) {
                    //这里肯定不是第一次调用查询了，所以计算第一次轮训的等待时间
                    var rule = new _schedule.RecurrenceRule();
                    var times = [new Date().getSeconds()+2>=60?0:new Date().getSeconds()+2];
                    rule.second = times;
                    _this.record.askTimes=_this.record.askTimes+1;
                            
                    var j=new _schedule.scheduleJob(rule, function(){
                        //console.log("3 response:"+response);
                        _this.SecondHttp(_this.record.reqId,"onError");
                        j.cancel();
                    });
                }else{
                    _this.record.enterWaitingAnswerTime=new Date().getTime();
                    _this.record.step=3;
                    _this.record.err=1;
                    _this.end('_');
                }
          
    });
    req.write(httpdata);
    req.end();
}

let driverStr='mongodb://localhost:27017/gzzf_testme';
Executor.prototype.end=function(ret){
    this.record.ret=ret;
    this.record.endTime=new Date().getTime();
    var _this=this;
    Mongo.connect(driverStr, function(err, db) {
        if (err) {
            console.log(err);
        }else{
            console.log("Connected correctly to server");
            
            var z_enterWaitingAnswerSpend=_this.record.enterWaitingAnswerTime-_this.record.startTime;
            var z_endQuerySpend=_this.record.endTime-_this.record.startTime;
            db.collection('testme').insertOne({
                'catalog':_this.record.catalogName,
                'id':_this.record.id,
                'sid':_this.record.sid,//对应传到服务的sid
                'fileIndex':_this.record.fileIndex,//文件的id 0~3 对应 3 5 7 9秒
                'startTime':_this.record.startTime,//第一个请求的发起时间点
                'enterWaitingAnswerTime':_this.record.enterWaitingAnswerTime,//第一次请求完成，进入轮训结果的时间点
                'endTime':_this.record.endTime,//获取答案，完成整个流程的时间点
                'askTimes':_this.record.askTimes,//轮训次数,只算请求结果的轮训
                'err':_this.record.err,//0执行完毕无异常 , 其他值执行失败
                'reqId':_this.record.reqId,//保存请求id
                'step':_this.record.step,//第一次请求为1，第一次请求成功回调2 ，第一次请求error 3，第二次请求执行4 ，第二次成功5，第二次error6
                'ret':_this.record.ret,//最终结果
                'z_enterWaitingAnswerSpend':z_enterWaitingAnswerSpend,
                'z_endQuerySpend':z_endQuerySpend
            });
        }
        db.close();
    });
   
}

module.exports=Executor;