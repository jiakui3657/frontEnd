// @Author: outman_qiaopeng  Date: 2018-09-12 14:44:24
import request from '@/utils/request'

/**
 * 自动抓拍事件
 */
export function getData(data) {
  return request({
    // url: '/event/photo',`${baseUrl}?a=${a}&b=${b}&c=${c}`
    url: `/event/upload?pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
    // url: '/event/ic?pageNum=1&pageSize=10',
    method: 'get'
  })
}

// 获取列表
export function getDriverList(params) {
  return request({
    url: '/event/upload',
    method: 'get',
    params
  })
}
