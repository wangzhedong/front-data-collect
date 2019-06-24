// index.js 入口文件
import Vue from 'vue';
import App from './App.vue'
import ElementUI from 'element-ui'
import '@/assets/styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'
import store from '@/store/index.js'
import router from './router'
import api from './api/index'

import '@/assets/font-awesome-4.7.0/css/font-awesome.min.css'
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$api = api
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});