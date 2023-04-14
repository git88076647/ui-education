import request from '@/utils/request'

// 查询锁列表
export function listLock(query) {
  return request({
    url: '/monitor-api/monitor/distributedLock/list',
    method: 'get',
    params: query
  })
}


// 释放锁
export function releaseLock(key) {
  return request({
    url: '/monitor-api/monitor/distributedLock/' + key,
    method: 'delete'
  })
}
