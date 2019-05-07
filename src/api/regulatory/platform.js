import request from '@/utils/request'

export function platFormData(query) { // 第一栏
  return request({
    url: '/platform/analyze/data',
    method: 'get',
    params: query
  })
}

export function control(query) { // 第二栏
  return request({
    url: '/platform/analyze/control',
    method: 'get',
    params: query
  })
}

export function assessment(query) { // 第三栏
  return request({
    url: '/platform/analyze/assessment',
    method: 'get',
    params: query
  })
}
