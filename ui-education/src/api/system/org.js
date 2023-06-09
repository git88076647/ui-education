import request from '@/utils/request'

// 查询组织列表
export function listOrg(query) {
    return request({
        url: '/auth-api/system/org/list',
        method: 'get',
        params: query
    })
}

// 查询组织详情
export function getOrg(orgId) {
    return request({
        url: '/auth-api/system/org/' + orgId,
        method: 'get'
    })
}

// 查询组织下拉树结构
export function treeselect() {
    return request({
        url: '/auth-api/system/org/treeselect',
        method: 'get'
    })
}

// 根据角色ID查询组织树结构
export function roleOrgTreeselect(roleId) {
    return request({
        url: '/auth-api/system/org/roleOrgTreeselect/' + roleId,
        method: 'get'
    })
}

// 新增组织
export function addOrg(data) {
    return request({
        url: '/auth-api/system/org',
        method: 'post',
        data: data
    })
}

// 修改组织
export function updateOrg(data) {
    return request({
        url: '/auth-api/system/org',
        method: 'put',
        data: data
    })
}

// 删除组织
export function delOrg(orgId) {
    return request({
        url: '/auth-api/system/org/' + orgId,
        method: 'delete'
    })
}