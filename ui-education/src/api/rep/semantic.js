import request from '@/utils/request'

// 查询语义模型列表
export function listSemantic(query) {
    return request({
        url: '/report-api/rep/semantic/list',
        method: 'get',
        params: query
    })
}

// 查询语义模型详情
export function getSemantic(pkSemantic) {
    return request({
        url: '/report-api/rep/semantic/' + pkSemantic,
        method: 'get'
    })
}

// 新增语义模型
export function addSemantic(data) {
    return request({
        url: '/report-api/rep/semantic',
        method: 'post',
        data: data
    })
}

// 修改语义模型
export function updateSemantic(data) {
    return request({
        url: '/report-api/rep/semantic',
        method: 'put',
        data: data
    })
}

// 删除语义模型
export function delSemantic(pkSemantic) {
    return request({
        url: '/report-api/rep/semantic/' + pkSemantic,
        method: 'delete'
    })
}

// 导出语义模型
export function exportSemantic(query) {
    return request({
        url: '/report-api/rep/semantic/export',
        method: 'get',
        params: query
    })
}

// 执行语义模板
export function execSemantic(id, paramMap) {
  return request({
    url: '/report-api/rep/semantic/exec/' + id,
    method: 'post',
    data: paramMap
  })
}

// 执行语义模板后的结果字段描述
export function getSemanticResultMeta(id, sql) {
  return request({
    url: '/report-api/rep/semantic/getresultmeta/' + id,
    method: 'post',
    data: sql
  })
}

// 执行语义模板后的结果字段描述
export function getSemanticResultMetas(ids){
    return request({
        url: '/report-api/rep/semantic/getresultmeta',
        method: 'post',
        data: ids
    })
}