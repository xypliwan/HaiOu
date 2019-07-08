
import axios from '@/utils/axios'
//公共接口



//获取状态值
export function getStatus(data={}){    
    return axios({
        url:`/common/status?status_code=${data.status_code}`,
        method:"get",
    })
};

//获取类型值
export function getTypes(data={}){    
    return axios({
        url:`/common/type?type_code=${data.type_code}`,
        method:"get",
    })
};



//获取销售产品(物流渠道)
export function getChannelList(data={}){    
    return axios({
        url:`/common/channel`,
        method:"get",
    })
};


//获取国家
export function getCounrty(data={}){    
    return axios({
        url:`/common/country`,
        method:"get",
    })
};

//获取字典
export function getDict(data={}){    
    return axios({
        url:`/common/dict?dict_code=${data.dict_code}`,
        method:"get",
    })
};