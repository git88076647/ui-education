import request from '@/utils/request'

// 查询后台日志列表
export function list(query) {
    return request({
        url: '/log-api/log/backlog/list',
        method: 'get',
        params: query
    })
}
