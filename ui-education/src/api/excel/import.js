import request from '@/utils/request'

// 新增任务
export function addTask(data) {
  return request({
    url: '/hnym-api/excel/import',
    method: 'post',
    data: data
  })
}

// 任务停止
export function stopTask(uuid) {
  return request({
    url: '/hnym-api/excel/stop/' + uuid,
    method: 'post',
  })
}
// 导入任务列表
export function listTask(query) {
  return request({
    url: '/hnym-api/excel/list',
    method: 'get',
    params: query
  })
}

// 导入任务列表错误数据
export function errorDatasByES(indexName,query) {
  return request({
    url: '/log-api/log/search/list/' + indexName ,
    method: 'get',
    params: query
  })
}
// 导入任务列表错误数据
export function errorDatas(query) {
  return request({
    url: '/hnym-api/excel/faildata/list',
    method: 'get',
    params: query
  })
}

// 查询任务详情
export function getTask(id) {
  return request({
    url: '/hnym-api/excel/info/' + id,
    method: 'get'
  })
}

// 删除任务
export function delTask(id) {
  return request({
    url: '/hnym-api/excel/del/' + id,
    method: 'delete'
  })
}

// 清空已完成任务
export function cleanFinish(exectype) {
  return request({
    url: '/hnym-api/excel/cleanFinish?exectype=' + exectype ,
    method: 'delete'
  })
}
