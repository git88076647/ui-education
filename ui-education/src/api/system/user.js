import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/czyl";
import { encrypt } from '@/utils/jsencrypt'
// 查询用户列表
export function listUser(query) {
    return request({
        url: '/auth-api/system/user/list',
        method: 'get',
        params: query
    })
}
// 查询用户列表
export function refUser(query) {
    return request({
        url: '/auth-api/system/user/ref',
        method: 'get',
        params: query
    })
}

// 查询用户详情
export function getUser(userId) {
    return request({
        url: '/auth-api/system/user/' + praseStrEmpty(userId),
        method: 'get'
    })
}

// 新增用户
export function addUser(data) {
    return request({
        url: '/auth-api/system/user',
        method: 'post',
        data: data
    })
}

// 修改用户
export function updateUser(data) {
    return request({
        url: '/auth-api/system/user',
        method: 'put',
        data: data
    })
}

// 删除用户
export function delUser(userId) {
    return request({
        url: '/auth-api/system/user/' + userId,
        method: 'delete'
    })
}

// 解冻用户
export function thawUser(userCodes) {
    return request({
        url: '/auth-api/system/user/thaw?userCodes=' + userCodes,
        method: 'post',
    })
}

// 导出用户
export function exportUser(query) {
    return request({
        url: '/auth-api/system/user/export',
        method: 'get',
        params: query
    })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
    password = encrypt(password);
    const data = {
        userId,
        password
    }
    return request({
        url: '/auth-api/system/user/resetPwd',
        method: 'put',
        data: data
    })
}

// 用户状态修改
export function changeUserStatus(userId, status,version) {
    const data = {
        userId,
        status,
        version
    }
    return request({
        url: '/auth-api/system/user/changeStatus',
        method: 'put',
        data: data
    })
}

// 查询用户个人信息
export function getUserProfile() {
    return request({
        url: '/auth-api/system/user/profile',
        method: 'get'
    })
}

// 修改用户个人信息
export function updateUserProfile(data) {
    return request({
        url: '/auth-api/system/user/profile',
        method: 'put',
        data: data
    })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
    oldPassword = encrypt(oldPassword);
    newPassword = encrypt(newPassword);
    const data = {
        oldPassword,
        newPassword
    }
    return request({
        url: '/auth-api/system/user/profile/updatePwd',
        method: 'put',
        params: data
    })
}

// 用户头像上传
export function uploadAvatar(data) {
    return request({
        url: '/auth-api/system/user/profile/avatar',
        method: 'post',
        data: data
    })
}