import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局的样式表
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid' // 树形表格treeTable
import qs from 'qs' //解析post的数据
import {Message} from 'element-ui'
import './api/mock.js' 
import store from './store'

import Print from 'vue-print-nb'
Vue.use(Print);

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.prototype.$bus= new Vue()


Vue.component('tree-table', TreeTable) // 树形表格treeTable

axios.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token'); //请求带上token
        return config
})


const baseURL = process.env.NODE_ENV === 'development' ? '/api' : '/ywzj'
const baseURL1 = process.env.NODE_ENV === 'development' ? '/api' : 'ywzj/'
Vue.prototype.$http = axios.create({
    baseURL
}); 


Vue.prototype.qs = qs; // post解析数据用的
Vue.prototype.ips = baseURL1; // 暂时不知道是什么东西 
Vue.config.productionTip = false; // 阻止启动生产消息


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')