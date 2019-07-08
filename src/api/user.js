import axios from '@/utils/axios'
//用户模块

// 登陆
export function login(data={}){    
    return axios({
        url:`/user/login`,
        method:"post",
        data
    })
};

// 退出
export function logout(data={}){    
    return axios({
        url:`/user/logout`,
        method:"post",
        data
    })
};


//用户查询
export function userSearch(data={}){    
    return axios({
        url:`/user/search`,
        method:"post",
        data
    })
};


//编辑用户
export function editUser(data={}){    
    return axios({
        url:`/user/edit`,
        method:"post",
        data
    })
};

//修改密码
export function changePassword(data={}){    
    return axios({
        url:`/user/change-password`,
        method:"post",
        data
    })
};


//获取用户信息
export function getUserInfo(data={}){    
    return axios({
        url:`/user/view`,
        method:"get"
    })
};