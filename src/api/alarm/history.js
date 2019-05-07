import request from '@/utils/request'

export function getHistory(data) {
  return request({
    url: '/moni/urgeTodo',
    method: 'get',
    params: data
  })
}

export function getAlarmType() {
  return request({
    url: '/moni/alarmtype',
    method: 'get'
  })
}

export function exportHistory() {
  return request({
    url: '/moni/urgeTodo/excel',
    method: 'get'
  })
}
