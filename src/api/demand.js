import axios from '@/utils/axios'
//需求模块

//需求列表
export function getDemandList(data={}){    
    return axios({
        url:`/v1/demand/list`,
        method:"post",
        data
    })
};

//分配客服
export function demandAssign(data={}){    
    return axios({
        url:`/v1/demand/assign`,
        method:"post",
        data
    })
};


//需求详情
export function demandDetail(data={}){   
    return axios({
        url:`/v1/demand/view?company_code=${data.company_code}&demand_number=${data.demand_number}`,
        method:"get",
    })
};


//
//回复需求
export function demandReply(data={}){   
    return axios({
        url:`/v1/demand/reply`,
        method:"post",
        data
    })
};