'use strict';

let _schedule=require('node-schedule');
/**
 *每秒执行一次
 */
function _scheduleSample(){

}

_scheduleSample.prototype.test=function(id){
    var rule = new _schedule.RecurrenceRule();
　　var times = [];
　　for(var i=0; i<60; i++){
        if (id==0||i%id==0) {
            console.log(id +" "+i);
    　　　　times.push(i);
        }
　　}
　　rule.second = times;
　　var c=0;
    var start=new Date().getTime();
　　var j = new _schedule.scheduleJob(rule, function(){
     　　 c++;
          if (c>4) {//如果5还没返回，则认为失败
            //if (id==499) 
            console.log(id+" , "+(new Date().getTime()-start));
            return j.cancel()
          }
      　　console.log("id="+id+",c="+c);
　　});
};

(function(){
    for(let i=0;i<10;i++){
        new _scheduleSample().test(i);
    }
})();