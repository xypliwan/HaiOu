import axios from '@/utils/axios'
//文件上传

// 登陆
export function uploadPdf(data={}){    
    return axios({
        url:`/upload/pdf`,
        method:"post",
        data
    })
};