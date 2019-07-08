import axios from '@/utils/axios'
// 控制面板

//需求列表
export function getPanelWeek(data = {}) {
    return axios({
        url: `/v1/panel/week`,
        method: "post",
        data
    })
};


//代办统计
export function getToDO(data = {}) {
    return axios({
        url: `/v1/panel/to-do`,
        method: "get"
    })
};

//获取快捷方式
export function getShortcut(data = {}) {
    return axios({
        url: `/v1/panel/shortcut`,
        method: "get"
    })
};

//保存快捷方式
export function saveShortcut(data = {}) {
    return axios({
        url: `/v1/panel/save-shortcut`,
        method: "post",
        data
    })
};

//运单统计图表
export function getChartWay(data = {}) {
    return axios({
        url: `/v1/panel/chart-way`,
        method: "post",
        data
    })
};


//轨迹查询
export function getHomeTrajectorySearch(data = {}) {
    return axios({
        url: `/v1/track/search`,
        method: "post",
        data
    })
};