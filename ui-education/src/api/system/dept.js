import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
    return request({
        url: '/auth-api/system/dept/list',
        method: 'get',
        params: query
    })
}

// 查询部门详情
export function getDept(deptId) {
    return request({
        url: '/auth-api/system/dept/' + deptId,
        method: 'get'
    })
}

// 查询部门下拉树结构
export function treeselect(orgId) {
    return request({
        url: '/auth-api/system/dept/treeselect',
        method: 'get',
        params: { 'orgId': orgId }
    })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
    return request({
        url: '/auth-api/system/dept/roleDeptTreeselect/' + roleId,
        method: 'get'
    })
}

// 新增部门
export function addDept(data) {
    return request({
        url: '/auth-api/system/dept',
        method: 'post',
        data: data
    })
}

// 修改部门
export function updateDept(data) {
    return request({
        url: '/auth-api/system/dept',
        method: 'put',
        data: data
    })
}

// 删除部门
export function delDept(deptId) {
    return request({
        url: '/auth-api/system/dept/' + deptId,
        method: 'delete'
    })
}