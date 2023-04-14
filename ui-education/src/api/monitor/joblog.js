import request from '@/utils/request'

// 查询任务调度日志列表
export function listJoblog(query) {
  return request({
    url: '/job-api/dispatcher/joblog/list',
    method: 'get',
    params: query
  })
}

// 查询任务调度日志详情
export function getJoblog(jobLogId) {
  return request({
    url: '/job-api/dispatcher/joblog/' + jobLogId,
    method: 'get'
  })
}

// 新增任务调度日志
export function addJoblog(data) {
  return request({
    url: '/job-api/dispatcher/joblog',
    method: 'post',
    data: data
  })
}

// 修改任务调度日志
export function updateJoblog(data) {
  return request({
    url: '/job-api/dispatcher/joblog',
    method: 'put',
    data: data
  })
}

// 删除任务调度日志
export function delJoblog(jobLogId) {
  return request({
    url: '/job-api/dispatcher/joblog/' + jobLogId,
    method: 'delete'
  })
}

// 导出任务调度日志
export function exportJoblog(query) {
  return request({
    url: '/job-api/dispatcher/joblog/export',
    method: 'get',
    params: query
  })
}

// 清空任务调度日志
export function cleanJoblog() {
  return request({
    url: '/job-api/dispatcher/joblog/clean',
    method: 'delete'
  })
}