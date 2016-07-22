module.exports.each=function(whichClass,tagName,obj){
    console.log("Iterator::each-->"+whichClass+":"+tagName);
    // 用来保存所有的属性名称和值 
    // 开始遍历 
    for(var p in obj){  
        // 方法 
        if(typeof(obj[p])=="function"){  
            console.log(p+":"+obj[p]+" ,is function");
            //obj[p](); 
        }else if(obj[p] =='[object Object]'){
            //allPrpos(obj[p],props);
            console.log(p+":"+obj[p]+" ,is [object Object]");
            //props += p + "=" + obj[p] + ";  "; 
        }else{  
            // p 为属性名称，obj[p]为对应属性的值
            console.log(p+":"+obj[p]+" ,is value");
            //props += p + "=" + obj[p] + ";  "; 
        }  
    }  
   //return props;    
}