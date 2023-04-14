import request from '@/utils/request'

// 查询在线应用列表
export function treeselect() {
    return request({
        url: '/monitor-api/monitor/apps',
        method: 'get',
    })
}

// 查询在线应用的实例列表
export function listInstance(appId) {
    return request({
        url: '/monitor-api/monitor/apps/'+appId,
        method: 'get',
    })
}

// 应用实例下线
export function down(appId,instanceId) {
    return request({
        url: '/monitor-api/monitor/apps/'+appId+"/"+instanceId+"/down",
        method: 'put',
    })
}

// 应用实例上线
export function up(appId,instanceId) {
    return request({
        url: '/monitor-api/monitor/apps/'+appId+"/"+instanceId+"/up",
        method: 'delete',
    })
}

// 应用实例停机
export function shutdown(appId,instanceId) {
    return request({
        url: '/monitor-api/monitor/apps/'+appId+"/"+instanceId+"/shutdown",
        method: 'put',
    })
}

// 应用实例重启
export function reload(appId,instanceId) {
    return request({
        url: '/monitor-api/monitor/apps/'+appId+"/"+instanceId+"/reload",
        method: 'put',
    })
}

// 应用实例重新注册
export function refresh(appId,instanceId) {
    return request({
        url: '/monitor-api/monitor/apps/'+appId+"/"+instanceId+"/refresh",
        method: 'put',
    })
}
