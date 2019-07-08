import axios from 'axios'
import { getLocalStorage, clearLocalStorage, removeLocalStorage } from "@/utils/localStorage";
import { Message } from 'element-ui'
import baseURL from "@/config/baseUrl"
import router from '@/router/index'
import { formatMessage } from '_u/utils';

const service = axios.create({
  baseURL: baseURL,
  timeout: 40000
});

//请求拦截器
service.interceptors.request.use(config => {
  let userinfo = getLocalStorage('userinfo');
  if (userinfo) {
    config.headers["Content-Type"] = "application/json";
    config.headers["Authorization"] = `Bearer ${userinfo.access_token}`;
  }
  return config;
}, error => {
  Message.error({
    message: JSON.stringify(error),
    showClose: true,
    type: "error"
  })
  return Promise.reject(error)
})
// 添加响应拦截器
service.interceptors.response.use(
  response => {

    let res = response.data
    if (res.code == 200) {
      if (res.error == 1001) {
        Message.error({
          message: "登陆过期，重新登录",
          showClose: true,
          type: "error"
        })
        removeLocalStorage("userinfo")
        router.push('/entran/login')
        return Promise.reject(formatMessage(res.message))
      } else if (res.error == 0) {
        return res;
      } else {
        return Promise.reject(formatMessage(res.message))
      }
    } else {      //出错
      if (process.env.NODE_ENV === "development") {
        Message.error({
          message: `服务端错误：${JSON.stringify(res)}`,
          showClose: true,
          type: "error"
        })
      } else {
        Message.error({
          message: `服务器异常`,
          showClose: true,
          type: "error"
        })
      }
    }
  },
  error => {
    Message.error({
      message: `服务端异常`,
      showClose: true,
      type: "error"
    })
    return Promise.reject(error)
  }
)
export default service;
