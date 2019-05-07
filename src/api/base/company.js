// @Author: outman_qiaopeng  Date: 2018-09-18 16:09:19
import request from '@/utils/request'

/**
 * 企业列表
 */
export function owersList(query) {
  return request({
    url: '/base/owers',
    method: 'get',
    params: query
  })
}

/**
 * 根据运营商平台查询业户列表
 */
export function owersListByPlatform(platformId) {
  return request({
    url: '/base/owers/byPlatform/' + platformId,
    method: 'get'
  })
}

/**
 * 删除业户
 */
export function deletePlatform(platformId) {
  return request({
    url: '/base/owers/' + platformId,
    method: 'delete'
  })
}

/**
 * 业户树
 */
export function getDeptTree(platformId) {
  return request({
    url: '/base/owers/tree/' + platformId,
    method: 'get'
  })
}

/**
 * 业户树编辑时用，不包含本身
 */
export function getDeptTreeEdit(platformId, owerId) {
  return request({
    url: '/base/owers/owersTreeEdit/' + platformId + '/' + owerId,
    method: 'get'
  })
}

/**
 * 新增业户
 */
export function save(data) {
  return request({
    url: '/base/owers',
    method: 'post',
    data: data
  })
}

/**
 * 业户详情
 */
export function detailOwers(id) {
  return request({
    url: '/base/owers/' + id,
    method: 'get'
  })
}

/**
 * 修改业户
 */
export function reFixed(data) {
  return request({
    url: '/base/owers',
    method: 'put',
    data: data
  })
}

/**
 * 车辆档案导出
 *
 */
export function enterpriseExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/base/owers/enterpriseExcel',
    method: 'get',
    params: prodata
  })
}
