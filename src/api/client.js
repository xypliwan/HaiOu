import axios from '@/utils/axios'
//客户



//获取客户列表（公司列表）
export function getCustomerList(data = {}) {
    return axios({
        url: `/v1/customer/list`,
        method: "post",
        data
    })
};


//编辑客户（编辑）
export function editCustomer(data = {}) {
    return axios({
        url: `/v1/customer/edit`,
        method: "post",
        data
    })
};

//获取客户详情
export function getCustomerDetail(data = {}) {
    return axios({
        url: `/v1/customer/detail`,
        method: "post",
        data
    })
};


//编辑客户详情
export function editCustomerDetail(data = {}) {
    return axios({
        url: `/v1/customer/edit`,
        method: "post",
        data
    })
};

//关键词搜索客户查询
export function searchCustomerList(data = {}) {
    return axios({
        url: `/v1/customer/search`,
        method: "post",
        data
    })
};


//获取客户分组
export function getCustomerGroup(data = {}) {
    return axios({
        url: `/v1/customer/group`,
        method: "get"
    })
};

//分配客服人员
export function assignStaff(data = {}) {
    return axios({
        url: `/v1/customer/assign-staff`,
        method: "post",
        data
    })
};

//客户标签选择
export function selectCompanyLabel(data = {}) {
    return axios({
        url: `/v1/company-label/select`,
        method: "get",
    })
};

//子帐号列表
export function getCustomerUserList(data = {}) {
    return axios({
        url: `/v1/customer/customer-user-list`,
        method: "post",
        data
    })
};

//客户详情
export function getCompanyDetail(data = {}) {
    return axios({
        url: `/v1/customer/view?id=${data.id}`,
        method: "get",
    })
};


//开通tms
export function openApp(data = {}) {
    return axios({
        url: `/v1/customer/register-app`,
        method: "post",
        data
    })
};

//审核客户
export function verifyClient(data = {}) {
    return axios({
        url: `/v1/customer/verify`,
        method: "post",
        data
    })
};
