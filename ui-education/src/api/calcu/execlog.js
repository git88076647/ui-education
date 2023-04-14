import request from '@/utils/request'

// 查询执行日志列表
export function listExeclog(query) {
  return request({
    url: '/hnym-api/calcu/execlog/list',
    method: 'get',
    params: query
  })
}

// 查询执行日志详情
export function getExeclog(id) {
  return request({
    url: '/hnym-api/calcu/execlog/' + id,
    method: 'get'
  })
}

// 新增执行日志
export function addExeclog(data) {
  return request({
    url: '/hnym-api/calcu/execlog',
    method: 'post',
    data: data
  })
}

// 修改执行日志
export function updateExeclog(data) {
  return request({
    url: '/hnym-api/calcu/execlog',
    method: 'put',
    data: data
  })
}

// 删除执行日志
export function delExeclog(id) {
  return request({
    url: '/hnym-api/calcu/execlog/' + id,
    method: 'delete'
  })
}

// 导出执行日志
export function exportExeclog(query) {
  return request({
    url: '/hnym-api/calcu/execlog/export',
    method: 'get',
    params: query
  })
}