import request from '@/utils/request'

// 查询服务器详情
export function getServer(appId, instanceId) {
    return request({
        url: '/monitor-api/monitor/server/' + appId + '/' + instanceId + '/info',
        method: 'get'
    })
}