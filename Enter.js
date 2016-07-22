'use strict';
/**
 *入口
 */
var cp=require('child_process');

function test1() {
   
   let a=true;
   let b=true;
   let c=true;
   let d=true;
    
    if (a) {
        let workProcess1=cp.fork('./voiceQuery/main.js');
        workProcess1.on('exit', function (code) {
            if (code != 0) {
                //restart or...
            }   
        });
    }
    if (b) {
        let workProcess1=cp.fork('./voiceQuery/main.js');
        workProcess1.on('exit', function (code) {
            if (code != 0) {
                //restart or...
            }   
        });
    }
    if (c) {
        let workProcess1=cp.fork('./voiceQuery/main.js');
        workProcess1.on('exit', function (code) {
            if (code != 0) {
                //restart or...
            }   
        });
    }
    if (d) {
        let workProcess1=cp.fork('./voiceQuery/main.js');
        workProcess1.on('exit', function (code) {
            if (code != 0) {
                //restart or...
            }   
        });
    }
    


 
}

function test2() {
    let workProcess1=cp.fork('./Samples.js');
    workProcess1.on('exit', function (code) {
        if (code != 0) {
            //restart or...
        }   
    });    
//
//    let workProcess2=cp.fork('./Samples.js');
//    workProcess2.on('exit', function (code) {
//        if (code != 0) {
//            //restart or...
//        }   
//    });
//    
//    let workProcess3=cp.fork('./Samples.js');
//    workProcess3.on('exit', function (code) {
//        if (code != 0) {
//            //restart or...
//        }   
//    });    
//
//    let workProcess4=cp.fork('./Samples.js');
//    workProcess4.on('exit', function (code) {
//        if (code != 0) {
//            //restart or...
//        }   
//    }); 
}

(function(){
    test1();
})()