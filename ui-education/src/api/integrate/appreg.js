import request from '@/utils/request'

// 查询应用注册列表
export function listAppreg(query) {
  return request({
    url: '/auth-api/integrate/appreg/list',
    method: 'get',
    params: query
  })
}

// 查询应用注册详情
export function getAppreg(appregId) {
  return request({
    url: '/auth-api/integrate/appreg/' + appregId,
    method: 'get'
  })
}

// 新增应用注册
export function addAppreg(data) {
  return request({
    url: '/auth-api/integrate/appreg',
    method: 'post',
    data: data
  })
}

// 修改应用注册
export function updateAppreg(data) {
  return request({
    url: '/auth-api/integrate/appreg',
    method: 'put',
    data: data
  })
}

// 删除应用注册
export function delAppreg(appregId) {
  return request({
    url: '/auth-api/integrate/appreg/' + appregId,
    method: 'delete'
  })
}

// 导出应用注册
export function exportAppreg(query) {
  return request({
    url: '/auth-api/integrate/appreg/export',
    method: 'get',
    params: query
  })
}