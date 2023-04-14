import request from '@/utils/request'

// 查询登录日志列表
export function myList(query) {
    return request({
        url: '/log-api/log/logininfor/mylist',
        method: 'get',
        params: query
    })
}

// 查询登录日志列表
export function list(query) {
    return request({
        url: '/log-api/log/logininfor/list',
        method: 'get',
        params: query
    })
}

// 删除登录日志
export function delLogininfor(infoId) {
    return request({
        url: '/log-api/log/logininfor/' + infoId,
        method: 'delete'
    })
}

// 清空登录日志
export function cleanLogininfor() {
    return request({
        url: '/log-api/log/logininfor/clean',
        method: 'delete'
    })
}

// 导出登录日志
export function exportLogininfor(query) {
    return request({
        url: '/log-api/log/logininfor/export',
        method: 'get',
        params: query
    })
}