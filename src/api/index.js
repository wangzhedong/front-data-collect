// 配置API接口地址
//var root = window.document.location.origin+"/tpreport-admin/";
var root = '/api'
// 引用axios
import axios from 'axios'
import router from '@/router/index.js'
import {Message} from 'element-ui'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入

// 简单配置
NProgress.configure({easing: 'ease', speed: 500, showSpinner: false})


// http request 请求拦截器，有token值则配置上token值
axios.interceptors.request.use(
  config => {
    let token = window.sessionStorage.getItem('token');
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
/*axios.interceptors.response.use(
  response => {
    if(response.headers["x-auth-token"]){
      //设置token
      window.sessionStorage.setItem('token',response.headers["x-auth-token"])
    }
    return response;
  },
  error => {
      if (error.response) {
          switch (error.response.status) {
              case 401:
                  // 这里写清除token的代码
                  router.replace({
                      path: '/login',
                      query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
                  })
          }
      }
      return Promise.reject(error.response.data) 
  });
*/

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
function loadBg() {
  let bg=document.createElement('div');
  let style=bg.style;
  style.position='fixed';
  style.height='100%';
  style.width='100%';
  style.top=0;
  style.left=0;
  style.zIndex='99999';
  // style.background='red'
  document.body.appendChild(bg);
  setTimeout(()=>{
    document.body.removeChild(bg)
  },1000)
}
//接口处理函数
function apiAxios(method, url, params, success, failure) {
    //NProgress.remove();
  NProgress.start();loadBg()
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false
    //timeout:2000
    //headers:window.sessionStorage.getItem('token')
  })
    .then(function (res) {
      NProgress.done();
      //设置token
      if (res.headers["x-auth-token"]) {
        window.sessionStorage.setItem('token', res.headers["x-auth-token"])
      }
      if (res.data.code === 0) {
        if (success) {
          success(res.data.data ? res.data.data : res.data.msg)
        }
      } else if (res.data.status === '99') {
        // Message.error(res.data.msg);
        let url = window.location.href;
        let index = url.lastIndexOf('/');
        url=url.slice(0, index + 1);
        sessionStorage.clear();
        localStorage.clear();
        failure("登录超时，请重新登录");
        window.location.href=url+'login';
      } else if (res.data.code === '404') {
        if (failure) {
          failure("请求接口不存在");
        }
        //router.push({ path:"/404"});
      } else {
        if (failure) {
          failure(res.data.msg)
        } else {
          Message.error('error: ' + JSON.stringify(res.data.msg));
        }
      }
    })
    .catch(function (err) {
      NProgress.done();
      console.log('api error, HTTP CODE: ' + err);
      if (failure) {
        failure("请求错误");
      } else {
        Message.error('请检查网络设置');
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}
