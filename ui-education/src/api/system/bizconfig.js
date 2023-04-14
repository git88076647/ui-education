import request from '@/utils/request'
const querystring = require('querystring');

// 查询业务参数配置列表
export function listBizconfig(query) {
  return request({
    url: '/auth-api/system/bizconfig/list',
    method: 'get',
    params: query
  })
}

// 查询业务参数配置详情
export function getBizconfig(id) {
  return request({
    url: '/auth-api/system/bizconfig/' + id,
    method: 'get'
  })
}

// 新增业务参数配置
export function addBizconfig(data) {
  return request({
    url: '/auth-api/system/bizconfig',
    method: 'post',
    data: data
  })
}

// 修改业务参数配置
export function updateBizconfig(data) {
  return request({
    url: '/auth-api/system/bizconfig',
    method: 'put',
    data: data
  })
}

// 删除业务参数配置
export function delBizconfig(ids) {
  return request({
    url: '/auth-api/system/bizconfig/del',
    method: 'post',
    data: {delIds:ids}
  })
}

// 导出业务参数配置
export function exportBizconfig(query) {
  //去除value为null的key
  for (const key in query) { 
    if ( (!query[key]) || query[key] == '') {
      delete query[key]
    }
  }
  const exportURL = process.env.VUE_APP_BASE_API + '/auth-api/system/bizconfig/export?' + querystring.stringify(query);
  window.open(exportURL, "_blank")

}