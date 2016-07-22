"use strict";

/**
 *入口修改为Enter.js
 */

let _event=require('events');
let _util = require("util");
let _http=require('http');
let _fs=require('fs');
let _uuid=require('node-uuid');
//
let Executor=require("./ExecutorNew");
let Config=require("./config/Config");

function runTest() {
    for(let begin=0;begin<Config.queryConcurrentNumber;begin++){
        //用户传递sid参数到测试服务
        let sid=_uuid.v4();
        //一共放了4个文件 对应 3 5 7 9 秒，编号0~3
        let fileIndex=_randomInt(0,3);
        //告诉用户取哪个文件
        let executor=new Executor(begin,sid,fileIndex);
        executor.firstHttp();
    }
}


(function(){
    let str="------- 准备开始测试 -------"
    console.log(str);
    runTest();
})();

//-------------------------------
function* randomTest(min, max) {
    for (let i=0;i<10;i++) {
        console.log(_randomInt(0,3));
    }
    yield 0;
}

function* __randomInt(min, max) {
    yield _randomInt(min, max);
}

function _randomInt(min, max){ 
    switch(arguments.length){ 
        case 1: return parseInt(Math.random()*min+1); 
        case 2: return parseInt(Math.random()*(max-min+1) + min); 
        default: return 0;
    }
} 
