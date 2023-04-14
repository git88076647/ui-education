import request from '@/utils/request'

// 查询报表模板_语义模型关联列表
export function listtemplatesemantic(query) {
  return request({
    url: '/report-api/rep/templatesemantic/list',
    method: 'get',
    params: query
  })
}

// 查询报表模板_语义模型关联详情
export function gettemplatesemantic(pkTemplatetemplatesemantic) {
  return request({
    url: '/report-api/rep/templatesemantic/' + pkTemplatetemplatesemantic,
    method: 'get'
  })
}

// 新增报表模板_语义模型关联
export function addtemplatesemantic(data) {
  return request({
    url: '/report-api/rep/templatesemantic',
    method: 'post',
    data: data
  })
}

// 修改报表模板_语义模型关联
export function updatetemplatesemantic(data) {
  return request({
    url: '/report-api/rep/templatesemantic',
    method: 'put',
    data: data
  })
}

// 删除报表模板_语义模型关联
export function deltemplatesemantic(pkTemplatetemplatesemantic) {
  return request({
    url: '/report-api/rep/templatesemantic/' + pkTemplatetemplatesemantic,
    method: 'delete'
  })
}

// 导出报表模板_语义模型关联
export function exporttemplatesemantic(query) {
  return request({
    url: '/report-api/rep/templatesemantic/export',
    method: 'get',
    params: query
  })
}
