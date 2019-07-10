import axios from '@/utils/axios'
//物流模块


//获取运单列表
export function getWaybillList(data = {}) {
    return axios({
        url: `/tms/transport/list`,
        method: "post",
        data
    })
};

//导出运单
// export function exportXxcel(data = {}) {
//     return axios({
//         url: `/tms/transport/export-excel`,
//         method: "post",
//         data
//     })
// };


//获取运单详情
export function getWaybillDetail(data = {}) {
    return axios({
        url: `/tms/transport/view`,
        method: "post",
        data
    })
};

//获取运单同步列表
export function getWaybillSyncList(data = {}) {
    return axios({
        url: `/tms/transport/sync-list`,
        method: "post",
        data
    })
};

//运单同步
export function getWaybillSyncTms(data = {}) {
    return axios({
        url: `/tms/transport/sync-tms`,
        method: "post",
        data
    })
};



//获取海运始发地
export function getOrigins(data = {}) {
    return axios({
        url: `/tms/container-channel/origins`,
        method: "post",
        data
    })
};

//获取海运目的地
export function getDestinations(data = {}) {
    return axios({
        url: `/tms/container-channel/destinations`,
        method: "post",
        data
    })
};

//获取海运服务商
export function getServicesList(data = {}) {
    return axios({
        url: `/tms/container-channel/services`,
        method: "post",
        data
    })
};


//海运渠道价格列表
export function getChannelList(data = {}) {
    return axios({
        url: `/tms/container-price/list`,
        method: "post",
        data
    })
};

//海运物流承运商列表
export function getCarriersList(data = {}) {
    return axios({
        url: `/tms/container-channel/carriers`,
        method: "post",
        data
    })
};

//海运所有渠道列表（基础接口）
export function getChannelAllList(data = {}) {
    return axios({
        url: `/tms/container-channel/all-list`,
        method: "post",
        data
    })
};

//海运货柜类型
export function getChannelType(data = {}) {
    return axios({
        url: `/tms/container-channel/types`,
        method: "post",
        data
    })
};

//添加/编辑 海运价格
export function saveContainerPrice(data = {}) {
    return axios({
        url: `/tms/container-price/save`,
        method: "post",
        data
    })
};


//获取海运价格详情
export function getContainerDetail(data = {}) {
    return axios({
        url: `/tms/container-price/detail?container_id=${data.container_id}`,
        method: "get"
    })
};


//编辑/新增 海运渠道
export function editSeaChannel(data = {}) {
    return axios({
        url: `/tms/container-channel/save`,
        method: "post",
        data
    })
};

//获取海运渠道列表
export function getContainerChannelList(data = {}) {
    return axios({
        url: `/tms/container-channel/list`,
        method: "post",
        data
    })
};


//获取海运渠道列表
export function getContainerChannelDetail(data = {}) {
    return axios({
        url: `/tms/container-channel/detail?cc_id=${data.cc_id}`,
        method: "get"
    })
};



//物流渠道列表
export function getLogisticsChannelList(data = {}) {
    return axios({
        url: `/tms/service-channel/list`,
        method: "post",
        data
    })
};

//获取物流渠道详情
export function getLogisticsChannelDetail(data = {}) {
    return axios({
        url: `/tms/service-channel/view`,
        method: "post",
        data
    })
};

//重量段模板列表(模板类型)
export function getWeightTemplateList(data = {}) {
    return axios({
        url: `/tms/service-channel/weight-template-list`,
        method: "get"
    })
};

//编辑物流渠道
export function saveServiceChannel(data = {}) {
    return axios({
        url: `/tms/service-channel/save`,
        method: "post",
        data
    })
};


//渠道组数据列表
export function getServiceChannelGroupList(data = {}) {
    return axios({
        url: `/tms/service-channel/service-channel-group-list`,
        method: "get"
    })
};

//获取重量计费类型
export function getWeightType(data = {}) {
    return axios({
        url: `/tms/service-channel/get-weight-type`,
        method: "get"
    })
};



//获取重量段模板列表
export function getWeightTemplateListData(data = {}) {
    return axios({
        url: `/tms/service-channel/template-list`,
        method: "post",
        data
    })
};

//编辑重量段模板
export function saveWeightTemplate(data = {}) {
    return axios({
        url: `/tms/service-channel/template-save`,
        method: "post",
        data
    })
};


//查看重量段模板
export function getWeightTemplateDetail(data = {}) {
    return axios({
        url: `/tms/service-channel/template-view?wt_id=${data.wt_id}`,
        method: "get",
    })
};

//获取服务商选择
export function getServiceProvider(data = {}) {
    return axios({
        url: `/tms/service-provider/select`,
        method: "get",
    })
};

//物流承运商选择
export function getServiceCarrier(data = {}) {
    return axios({
        url: `/tms/service-carrier/select`,
        method: "get",
    })
};

