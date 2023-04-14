import request from '@/utils/request'

// 查询在线应用列表
export function list() {
    return request({
        url: '/monitor-api/monitor/server/druid/list',
        method: 'get',
    })
}