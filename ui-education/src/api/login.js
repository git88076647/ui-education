import request from '@/utils/request'
import { encrypt } from '@/utils/jsencrypt'

// 登录方法
export function login(userCode, password, code, uuid) {
    if (password && password.indexOf("CPF_Cxx~丨") < 0) {
        password = encrypt(password);
    }
    const data = {
        userCode,
        password,
        code,
        uuid
    }

    return request({
        url: '/auth-api/login',
        method: 'post',
        data: data
    })
}

// 获取用户详情信息
export function getInfo() {
    return request({
        url: '/auth-api/getInfo',
        method: 'get'
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/auth-api/logout',
        method: 'post'
    })
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: '/auth-api/captchaImage',
        method: 'get'
    })
}