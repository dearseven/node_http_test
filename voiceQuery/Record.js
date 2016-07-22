
function Record(_catalogName){
    this.catalogName=_catalogName;
    
    this.id;//id
    this.sid;//对应传到服务的sid
    this.fileIndex;//文件的id 0~3 对应 3 5 7 9秒
    this.startTime;//第一个请求的发起时间点
    this.enterWaitingAnswerTime;//第一次请求完成，进入轮训结果的时间点
    this.endTime;//获取答案，完成整个流程的时间点
    this.askTimes;//轮训次数,只算请求结果的轮训
    this.err;//0执行完毕无异常 , 其他值执行失败
    this.reqId;//保存请求id
    this.step=0;//第一次请求为1，第一次请求成功回调2 ，第一次请求error 3，第二次请求执行4 ，第二次成功5，第二次error6
    this.ret;//最终结果
}

module.exports=Record;
