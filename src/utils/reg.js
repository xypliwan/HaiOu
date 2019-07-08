export function skuReg(rule, value, callback){
    //只能输入阿拉伯数字、英文字母、中横杠
    let hanR = /^[A-Za-z0-9\-\_]+$/;
    if( value.length && !hanR.test(value) ){
        callback(new Error('只能输入阿拉伯数字、英文字母、中横杠'));
    }else if( !value.length ){
        callback(new Error('产品SKU不能为空'));
    }else if( value.length < 5 || value.length > 30 ){
        callback(new Error('英文长度必须在5 - 30个字符之间'));
    }else{
        callback()
    }
}

export function englishReg(rule, value, callback){
    //只能输入英文字母、英文符号、阿拉伯数字
    // var symbolReg = /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/;
    // let hanR = /^[A-Za-z0-9]+$/;
    // let noChina = /^[\u4e00-\u9fa5]+$/;
    var isChina = /[\u4E00-\u9FA5\uF900-\uFA2D]/;       //匹配中文字符
    if( isChina.test(value) ){
        callback(new Error('只能输入英文字母、英文符号、阿拉伯数字'));
    }
    else if( !value.length ||  value.length > 200){
        callback(new Error('英文名称不能为空'));
    }else{
        callback();
    }
  
}

export function moneyReg(rule,value,callback){    
    //金钱格式验证,且最多保留两位小数  
    var moneyR = /(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if( value.length && !moneyR.test(value) ){
        callback(new Error('请输入正确的金钱格式，最多保留三位小数'));
    }else if( !value.length ){
        callback(new Error('申报价格不能为空'));
    }else{
        callback();
    }
}

export function hscodeReg(rule,value,callback){
    // let hscodeR = /^[A-Za-z0-9]{1,10}$/;
    let hscodeR = /^[A-Za-z0-9\-\_]+$/;
    if( value.length && !hscodeR.test(value) ){
        callback(new Error('只能输入英文字母、数字、横线'));
    }else{
        callback();
    }
}

export function threeDimensReg(rule,value,callback){    
    //金钱格式验证,且最多保留两位小数  
    var moneyR = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if( value.length && !moneyR.test(value) ){
        callback(new Error('只能输入数字格式，最多保留两位小数'));
    }else{
        callback();
    }
}


export function isEmail(email) { 
    //验证邮箱正则
 let re = /^(([^()[\]\\.,;:\s@\"]+(\.[^()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 return re.test(email);
}

export function isPhone(phone){ 
    let re =/^[1][3,4,5,7,8][0-9]{9}$/;
    return re.test(phone)
}



//只能输入中文
export function chinaReg(rule, value, callback){
    let isChina = /^[\u4e00-\u9fa5]+$/;
    // console.log(!isChina.test(value))
    if( !value.length ||  value.length > 200){
        callback(new Error('中文菜单不能为空'));
    }else if( !isChina.test(value) ){
        callback(new Error('只能输入中文'));
    } else{
        callback();
    }
}

export function engNameReg(rule, value, callback){
    //只能输入阿拉伯数字、英文字母、中横杠
    let hanR = /^[A-Za-z0-9\-\_]+$/;
    if( !value.length ){
        callback(new Error('不能为空'));
    }else if( value.length && !hanR.test(value) ){
        callback(new Error('只能输入数字、字母、中横线、下划线'));
    }else{
        callback()
    }
}