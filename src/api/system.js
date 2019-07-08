import axios from '@/utils/axios'
//系统模块


//用户列表
export function getStaffList(data = {}) {
    return axios({
        url: `/v1/staff/list`,
        method: "post",
        data
    })
};

//新增员工
export function addStaff(data = {}) {
    return axios({
        url: `/v1/staff/add`,
        method: "post",
        data
    })
};

//编辑员工
export function editStaff(data = {}) {
    return axios({
        url: `/v1/staff/edit`,
        method: "post",
        data
    })
};


//员工详情
export function getStaffDetail(data = {}) {
    return axios({
        url: `/v1/staff/detail`,
        method: "post",
        data
    })
};



//添加合同模板
export function addTemplate(data = {}) {
    return axios({
        url: `/v1/contract/template-add`,
        method: "post",
        data
    })
};

//合同模板列表
export function contractTemplateList(data = {}) {
    return axios({
        url: `/v1/contract/template`,
        method: "post",
        data
    })
};

//查看模板详情
export function getTemplateDetail(data = {}) {
    return axios({
        url: `/v1/contract/template-view?template_no=${data.template_no}`,
        method: "get"
    })
};

//编辑模板详情
export function editTemplateDetail(data = {}) {
    return axios({
        url: `/v1/contract/template-edit`,
        method: "post",
        data
    })
};

//审核模板
export function reviewTemplate(data = {}) {
    return axios({
        url: `/v1/contract/template-verify`,
        method: "post",
        data
    })
};

//上报模板
export function contractReportTemplate(data = {}) {
    return axios({
        url: `/v1/contract/template-report`,
        method: "post",
        data
    })
};


//搜索模板
export function searchTemplateList(data = {}) {
    return axios({
        // url: `/v1/contract/template-search`,
        url: `/v1/contract/select-template`,
        method: "get",
    })
};



//新增合同
export function addContract(data = {}) {
    return axios({
        url: `/v1/contract/add`,
        method: "post",
        data
    })
};

//获取合同列表
export function getContractList(data = {}) {
    return axios({
        url: `/v1/contract/list`,
        method: "post",
        data
    })
};

//查看合同详情
export function getContractDetail(data = {}) {
    return axios({
        url: `/v1/contract/view?doc_number=${data.doc_number}`,
        method: "get",
    })
};


//查看合同详情
export function editContractDetail(data = {}) {
    return axios({
        url: `/v1/contract/edit`,
        method: "post",
        data
    })
};

//上报合同
export function reportContract(data = {}) {
    return axios({
        url: `/v1/contract/contract-report`,
        method: "post",
        data
    })
};

//审核合同
export function reviewContract(data = {}) {
    return axios({
        url: `/v1/contract/verify`,
        method: "post",
        data
    })
};

//签署合同
export function signContract(data = {}) {
    return axios({
        url: `/v1/contract/sign`,
        method: "post",
        data
    })
};

//新增/编辑缓存
export function saveCache(data = {}) {
    return axios({
        url: `/cache/save`,
        method: "post",
        data
    })
};


//缓存列表
export function getCacheList(data = {}) {
    return axios({
        url: `/cache/list`,
        method: "post",
        data
    })
};


//获取缓存详情
export function getCacheDetail(data = {}) {
    return axios({
        url: `/cache/detail?c_id=${data.c_id}`,
        method: "get",
    })
};


//删除缓存
export function deteleCache(data = {}) {
    return axios({
        url: `/cache/delete?c_id=${data.c_id}`,
        method: "get",
    })
};

//下载打印控件
export function installLodop(data = {}) {
    return axios({
        url: `/download/install-lodop`,
        method: "get",
    })
};

//获取账号配置项  (收费详情)
export function getAccountExtends(data = {}) {
    return axios({
        url: `/v1/account/get-extends?type=${data.type}`,
        method: "get",
    })
};

//编辑收款账号
export function saveAccountEdit(data = {}) {
    return axios({
        url: `/v1/account/edit`,
        method: "post",
        data
    })
};