import request from '@/utils/request'

// 查询语义模型参数列表
export function listSemparmar(query) {
    return request({
        url: '/report-api/rep/semparmar/list',
        method: 'get',
        params: query
    })
}

// 查询语义模型参数详情
export function getSemparmar(pkSemparmar) {
    return request({
        url: '/report-api/rep/semparmar/' + pkSemparmar,
        method: 'get'
    })
}

// 新增语义模型参数
export function addSemparmar(data) {
    return request({
        url: '/report-api/rep/semparmar',
        method: 'post',
        data: data
    })
}

// 修改语义模型参数
export function updateSemparmar(data) {
    return request({
        url: '/report-api/rep/semparmar',
        method: 'put',
        data: data
    })
}

// 删除语义模型参数
export function delSemparmar(pkSemparmar) {
    return request({
        url: '/report-api/rep/semparmar/' + pkSemparmar,
        method: 'delete'
    })
}

// 导出语义模型参数
export function exportSemparmar(query) {
    return request({
        url: '/report-api/rep/semparmar/export',
        method: 'get',
        params: query
    })
}