// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入全局样式
import '@/assets/index.css'

// 导入elementui - js
import ElementUI from 'element-ui'
// 导入elementui - css
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 安装插件
axios.interceptors.request.use(function(config) {
  // 在请求发送之前做一些事情
  // endsWith 字符串的方法,用来判断是不是以参数为结尾,如果是返回值为true

  // 判断如果是登录接口,就不需要添加 Authorization 请求头
  if (!config.url.endsWith('/login')) {
    config.headers['Authorization'] = localStorage.getItem('token')
  }
  // console.log('请求拦截器', config)
  return config
})

// 响应拦截器
axios.interceptors.response.use(function(response) {
  // 在获取到响应数据的时候做一些事情
  // console.log('响应拦截器', response)
  if (response.data.meta.status === 401) {
    // 因为现在不是在组件中,因此无法通过 this.$router 来访问到路由实例
    // 但是，可以直接通过上面导入的路由模块中的 router （路由实例）来访问到路由对象
    router.push('/login')
    localStorage.removeItem('token')
  }

  return response
})
Vue.use(ElementUI)

Vue.config.productionTip = false
// Add a request interceptor
// axios.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });
//
// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//     // Do something with response data
//     return response;
//   }, function (error) {
//     // Do something with response error
//     return Promise.reject(error);
//   });
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,

  // 注册 App 组件为当前实例的局部组件，然后，才可以在template中使用该组件
  components: { App },
  template: '<App/>'
})
