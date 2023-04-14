import request from '@/utils/request'

// 查询人员管理列表
export function listPsndoc(query) {

    if (query && (!query.orgId || query.orgId == '')) {
        query = JSON.parse(JSON.stringify(query));
        query.orgId = '-1';

    }
    return request({
        url: '/auth-api/system/psndoc/list',
        method: 'get',
        params: query
    })
}

// 查询人员任职记录
export function listPsnjobs(query) {
    return request({
        url: '/auth-api/system/psndoc/tabs',
        method: 'get',
        params: query
    })
}

// 查询人员管理详情
export function getPsndoc(psnId) {
    return request({
        url: '/auth-api/system/psndoc/' + psnId,
        method: 'get'
    })
}

// 新增人员管理
export function addPsndoc(data) {
    return request({
        url: '/auth-api/system/psndoc',
        method: 'post',
        data: data
    })
}

// 修改人员管理
export function updatePsndoc(data) {
    return request({
        url: '/auth-api/system/psndoc',
        method: 'put',
        data: data
    })
}

// 删除人员管理
export function delPsndoc(psnId) {
    return request({
        url: '/auth-api/system/psndoc/' + psnId,
        method: 'delete'
    })
}

// 导出人员管理
export function exportPsndoc(query) {
    return request({
        url: '/auth-api/system/psndoc/export',
        method: 'get',
        params: query
    })
}
