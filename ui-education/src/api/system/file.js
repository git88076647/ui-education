import request from '@/utils/request'

// 查询文件管理列表
export function listFile(query) {
  return request({
    url: '/file-api/system/file/list',
    method: 'get',
    params: query
  })
}

// 查询文件管理详情
export function getFile(fileId) {
  return request({
    url: '/file-api/system/file/' + fileId,
    method: 'get'
  })
}

// 新增文件管理
export function addFile(data) {
  return request({
    url: '/file-api/system/file',
    method: 'post',
    data: data
  })
}

// 修改文件管理
export function updateFile(data) {
  return request({
    url: '/file-api/system/file',
    method: 'put',
    data: data
  })
}

// 删除文件管理
export function delFile(fileId) {
  return request({
    url: '/file-api/system/file/' + fileId,
    method: 'delete'
  })
}

// 导出文件管理
export function exportFile(query) {
  return request({
    url: '/file-api/system/file/export',
    method: 'get',
    params: query
  })
}

// 上传文件
export function uploadFile(data) {
  return request({
      url: '/file-api/common/upload',
      method: 'post',
      data: data
  })
}