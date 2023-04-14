import request from '@/utils/request'

// 查询报表模板列表
export function listTemplate(query) {
  return request({
    url: '/report-api/rep/template/list',
    method: 'get',
    params: query
  })
}

// 查询报表模板详情
export function getTemplate(pkTemplate) {
  return request({
    url: '/report-api/rep/template/' + pkTemplate,
    method: 'get'
  })
}

// 新增报表模板
export function addTemplate(data) {
  return request({
    url: '/report-api/rep/template',
    method: 'post',
    data: data
  })
}

// 修改报表模板
export function updateTemplate(data) {
  return request({
    url: '/report-api/rep/template',
    method: 'put',
    data: data
  })
}

// 删除报表模板
export function delTemplate(pkTemplate) {
  return request({
    url: '/report-api/rep/template/' + pkTemplate,
    method: 'delete'
  })
}

// 导出报表模板
export function exportTemplate(query) {
  return request({
    url: '/report-api/rep/template/export',
    method: 'get',
    params: query
  })
}

