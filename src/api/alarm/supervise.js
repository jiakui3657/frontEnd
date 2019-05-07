import request from '@/utils/request'

export function getAlarminfo(data) {
  return request({
    url: '/moni/alarminfo',
    method: 'get',
    params: data
  })
}

export function postAlarminfo(data) {
  return request({
    url: '/moni/alarminfo',
    method: 'post',
    data
  })
}

export function getPermsList() {
  return request({
    url: '/base/platform/permslist',
    method: 'get'
  })
}

export function getAlarmSource() {
  return request({
    url: '/sys/dict/downMenu/alarm_source',
    method: 'get'
  })
}

export function getAlarminfoCore(data) {
  return request({
    url: '/moni/alarminfo/core',
    method: 'get',
    params: data
  })
}
