import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import {push as logpush} from '@/utils/logutils'
import qs from 'qs';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
    // 创建axios实例
const service = axios.create({
        // axios中请求配置有baseURL选项，表示请求URL公共部分
        baseURL: process.env.VUE_APP_BASE_API,
        // 超时
        timeout: 180000
    })
    // request拦截器
service.interceptors.request.use(
    config => {
        if (getToken()) {
            config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        if (config.method === 'get') {
          config.paramsSerializer = function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        }
        return config
    },
    error => {
        console.log(error)
        Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(res => {
        // console.log(res);
        // console.log(res.headers.app_trace_id);
        logpush(res.headers.app_trace_id,res.headers.apm_trace_id);
        const code = res.data.code
        if (code === 401) {
            MessageBox.confirm(
                '登录状态已过期，您可以继续留在该页面，或者重新登录',
                '系统提示', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                store.dispatch('LogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                })
            })
            return Promise.reject('重新登录')
        } else if (code !== 200) {
            Notification.error({
                title: res.data.msg
            })
            return Promise.reject('error')
        } else {
            return res.data
        }
    },
    error => {
        console.log('err' +error)
        try{
            logpush(res.headers.app_trace_id);
        }catch(ex99){}
        let msg;
        try {
            msg = error.response.data.msg;
        } catch (ex1) {}
        if (!msg || msg == '') {
            if(error.message.includes('timeout')){
                msg ='请求超时，请稍后再试！';
            }else if(error.message.includes('Request failed with status code 404')){
                msg ='请求地址错误，无法连接到服务器！';
            }else if(error.message.includes('Request failed with status code')){
                msg ='无法连接到服务器，请稍后再试！';
            }else{
                msg = error.message;
            }
        }
        Message({
            message: msg,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
