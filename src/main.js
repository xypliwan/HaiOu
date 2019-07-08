import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./assets/styles/global.scss";
import "./assets/font/iconfont.css";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import "./element-var.scss"

import i18n from "./i18n/i18n";

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

import VCharts from 'v-charts'
Vue.use(VCharts)

import mixin from '@/utils/mixin'
Vue.mixin(mixin);

Vue.use(Viewer)
Viewer.setDefaults({
  zIndexInline: 9999
})

Vue.use(ElementUI);

NProgress.inc(0.2);
NProgress.configure({
  easing: "ease",
  speed: 500,
  showSpinner: false
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

Vue.config.productionTip = false;

new Vue({
  data: {
    tableTitileStyle: {
      "background-color": "#f5f5f5",
      "color": "#333333",
      "font-weight": "bold",
      "font-size": "13px",
      "height": "40px",
    },
    tableContentStyle: {
      "font-size": "13px",
      "color": "#666666",
      "height": "60px",
    },
    viewShow: true,
    globalLoading: false

  },
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount("#app");
