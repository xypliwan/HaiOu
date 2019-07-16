import { getLocalStorage } from "_u/localStorage";
import { Message } from "element-ui";
import router from "@/router/index";

export function getToken() {
  let token = {};
  if (getLocalStorage("userinfo")) {
    token = {
      Authorization: `Bearer ${getLocalStorage("userinfo").access_token}`
    };
    return token
  } else {
    Message.error("登录失效，重新登录");
    setTimeout(() => {
      router.push("/user/login");
    }, 1000);
  }
}

//enter事件
export function keyupEnter(cb) {
  document.onkeydown = e => {
    if (e.keyCode === 13) {
      cb()
    }
  };
}

// 获取日期
export function dealDisabledDate(time) {
  // time.getTime是把选中的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数
  // Date.now()是把今天的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数,这样比较好比较
  // return的值,true是不可以操作选择,false可以操作选择,比如下面这个判断就只能选择今天之后的时间
  //   return time.getTime() < Date.now();

  // 这里减8.64e7的作用是,让今天的日期可以选择,如果不减的话,今天的日期就不可以选择,判断中写<= 也是没用的,一天的毫秒数就是8.64e7
  // return time.getTime() <= Date.now()
  return time.getTime() < Date.now() - 8.64e7
}
