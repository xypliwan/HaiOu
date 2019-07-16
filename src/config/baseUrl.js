
//海鸥后台运营端接口地址

let baseURL = '';

if (process.env.NODE_ENV === 'production') {
    if (process.env.VUE_APP_FLAG === 'pro') {
        //production 生产环境
        baseURL = 'xxxx';
    } else if (process.env.VUE_APP_FLAG === 'test') {
        //test 测试环境
        baseURL = 'yyyy';

    } else if (process.env.VUE_APP_FLAG === 'intr') {
        //local 内网环境
        baseURL = 'http://172.16.1.33:11092/';
    }


} else {
    //dev 开发环境
    baseURL = 'http://172.16.1.33:11092/';
}

export default baseURL;