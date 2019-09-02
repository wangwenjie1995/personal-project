import request from '@/utils/request'

export function reqAllQuotations() { // 请求报价工数数据(全部)
  return request({
    url: `/cost/show`,
    method: 'get'
  })
}

export function reqMyQuotations() { // 请求报价工数数据(我的)
  return request({
    url: `/cost/show/myself`,
    method: 'get'
  })
}

export function setQuotationList(data) { // 保存工数数据
  return request({
    url: '/cost/update',
    method: 'post',
    data
  })
}

export function reqTaskHistory(taskId) { // 请求工数task履历
  return request({
    url: `task/history/${taskId}`,
    method: 'get'
  })
}

export function reqIssue(baseId) { // 请求指摘
  return request({
    url: `/issue/cost/list/${baseId}`,
    method: 'get'
  })
}

export function addIssue(data) { // 添加指摘
  return request({
    url: '/issue/add',
    method: 'post',
    data
  })
}

export function checkDeleteTask(quoteId, userId, taskId) { // 检验是否能删除
  return request({
    url: `/task/delete/check/${quoteId}/${userId}/${taskId}`,
    method: 'get'
  })
}

export function reqDetailQuote(quoteId) { // 报价详情
  return request({
    url: `/task/list/${quoteId}`,
    method: 'get'
  })
}

export function reqSummaryAccount(quoteId, userId) {
  return request({
    url: `/cost/summary/${quoteId}/${userId}`,
    method: 'get'
  })
}

export function reqGroupList() { // 获取项目组列表接口
  return request({
    url: `/project/group/list`,
    method: 'get'
  })
}

export function reqDetail(funcId) {
  return request({
    url: `/cost/detail/${funcId}`,
    method: 'get'
  })
}

export function export_excel(userId, quotationId, type) {
  return request({
    url: `/exportsummary/${userId}/${quotationId}/${type}`,
    method: 'get'
  })
}

export function getMyGroupList() {
  return request({
    url: `/project/user/group/list`,
    method: 'get'
  })
}
