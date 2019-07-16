
//获取地址栏参数
export function getUrlKey(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

export function isPone(phone) {
    let phones = Number(phone)
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(phones)) {
        return false;
    } else {
        return true;
    }
}


export function formatMessage(data) {
    let message = '';
    if (Array.isArray(data)) {
        data.forEach(el => {
            message += `<p>${el}</p>`
        })
    } else {
        message = `<p>${data}</p>`
    }
    return message
}


//根据数组的某个key值去重
export function arrDeWeight(arr, key) {
    let result = [];
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i][key]]) {
            result.push(arr[i]);
            obj[arr[i][key]] = true;
        }
    }
    return result
}

//两个数组对象，取出不相同的
export function getDiffArr(arr1, arr2, name) {
    var result = [];
    for (var i = 0; i < arr2.length; i++) {
        var obj = arr2[i];
        var num = obj[name];
        var isExist = false;
        for (var j = 0; j < arr1.length; j++) {
            var aj = arr1[j];
            var n = aj[name];
            if (n == num) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            result.push(obj);
        }
    }
    // console.log(result);
    return result
}
