import request from '@/utils/request'

// 查询单据模板列表
export function listBilltpl(query) {
  return request({
    url: '/auth-api/system/billtpl/list',
    method: 'get',
    params: query
  })
}

/** 查询单据模板 */
export function refBilltpl(query) {
  return request({
    url: '/auth-api/system/billtpl/ref',
    method: 'get',
    params: query
  })
}

// 查询单据模板详情
export function getBilltpl(id) {
  return request({
    url: '/auth-api/system/billtpl/' + id,
    method: 'get'
  })
}

// 新增单据模板
export function addBilltpl(data) {
  return request({
    url: '/auth-api/system/billtpl',
    method: 'post',
    data: data
  })
}

// 修改单据模板
export function updateBilltpl(data) {
  return request({
    url: '/auth-api/system/billtpl',
    method: 'put',
    data: data
  })
}

// 重排序单据模板
export function reSortBilltpl(data) {
  return request({
    url: '/auth-api/system/billtpl/reSort',
    method: 'put',
    data: data
  })
}

// 删除单据模板
export function delBilltpl(id) {
  return request({
    url: '/auth-api/system/billtpl/' + id,
    method: 'delete'
  })
}

// 导出单据模板
export function exportBilltpl(query) {
  return request({
    url: '/auth-api/system/billtpl/export',
    method: 'get',
    params: query
  })
}