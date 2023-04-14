import request from '@/utils/request'

// 查询弱口令管理列表
export function listWeakpassword(query) {
  return request({
    url: '/auth-api/system/weakpassword/list',
    method: 'get',
    params: query
  })
}

// 查询弱口令管理详情
export function getWeakpassword(pwdId) {
  return request({
    url: '/auth-api/system/weakpassword/' + pwdId,
    method: 'get'
  })
}

// 新增弱口令管理
export function addWeakpassword(data) {
  return request({
    url: '/auth-api/system/weakpassword',
    method: 'post',
    data: data
  })
}

// 修改弱口令管理
export function updateWeakpassword(data) {
  return request({
    url: '/auth-api/system/weakpassword',
    method: 'put',
    data: data
  })
}

// 删除弱口令管理
export function delWeakpassword(pwdId) {
  return request({
    url: '/auth-api/system/weakpassword/' + pwdId,
    method: 'delete'
  })
}

// 导出弱口令管理
export function exportWeakpassword(query) {
  return request({
    url: '/auth-api/system/weakpassword/export',
    method: 'get',
    params: query
  })
}