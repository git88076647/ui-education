import request from '@/utils/request'

// 查询定时任务调度列表
export function listJob(query) {
  return request({
    url: '/job-api/dispatcher/job/list',
    method: 'get',
    params: query
  })
}

// 查询定时任务调度详情
export function getJob(jobId) {
  return request({
    url: '/job-api/dispatcher/job/' + jobId,
    method: 'get'
  })
}

// 新增定时任务调度
export function addJob(data) {
  return request({
    url: '/job-api/dispatcher/job',
    method: 'post',
    data: data
  })
}

// 修改定时任务调度
export function updateJob(data) {
  return request({
    url: '/job-api/dispatcher/job',
    method: 'put',
    data: data
  })
}

// 删除定时任务调度
export function delJob(jobId) {
  return request({
    url: '/job-api/dispatcher/job/' + jobId,
    method: 'delete'
  })
}

// 执行一次定时任务调度
export function runJob(jobId) {
  return request({
    url: '/job-api/dispatcher/job/run?jobId=' + jobId,
    method: 'post'
  })
}

// 导出定时任务调度
export function exportJob(query) {
  return request({
    url: '/job-api/dispatcher/job/export',
    method: 'get',
    params: query
  })
}