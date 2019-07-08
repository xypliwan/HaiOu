import axios from '@/utils/axios'

//新增  保存菜单
export function menuSave(data={}){    
    return axios({
        url:`/tool/menu/save`,
        method:"post",
        data
    })
};

// 菜单列表
export function getMenuList(data={}){    
    return axios({
        url:`/tool/menu/list`,
        method:"post",
        data
    })
};


//父级编码查询
export function menuSearch(data={}){    
    return axios({
        url:`/tool/menu/search`,
        method:"post",
        data
    })
};


//获取菜单列表  
export function getMenu(data={}){    
    return axios({
        url:`/tool/menu/get-menu`,
        method:"get"
    })
};

// // 保存语言
// export function saveLang(data={}){    
//     return axios({
//         url:`/tool/lang/save`,
//         method:"get"
//     })
// };


// 保存语言
export function downLang(data={}){    
    return axios({
        url:`/tool/lang/generate`,
        method:"post",
        data
    })
};





// 编辑  新增语言
export function saveLang(data={}){    
    return axios({
        url:`/tool/lang/save`,
        method:"post",
        data
    })
};

//获取语言包模块分组
export function getLangGroup(data={}){    
    return axios({
        url:`/tool/lang/group?group_ext=${data.group_ext}`,
        method:"get",
    })
};

//获取语言列表
export function getLangList(data={}){    
    return axios({
        url:`/tool/lang/list`,
        method:"post",
        data
    })
};


//获取语言文件
export function downloadGenerate(data={}){    
    return axios({
        url:`/lang/default/generate`,
        method:"post",
        data
    })
};


//获取标签模板详情
export function getLableDetail(data = {}) {
    return axios({
        url: `/tool/label/get-template?template_code=${data.template_code}`,
        method: "get",
    })
};


//新增标签模板
export function addTemplate(data = {}) {
    return axios({
        url: `/tool/label/add-template`,
        method: "post",
        data
    })
};

//标签模板列表
export function getTemplateList(data = {}) {
    return axios({
        url: `/tool/label/template-list`,
        method: "post",
        data
    })
};


//保存标签模板
export function saveTemplate(data = {}) {
    return axios({
        url: `/tool/label/save-template`,
        method: "post",
        data
    })
};