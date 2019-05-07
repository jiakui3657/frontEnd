import request from '@/utils/request'

/**
 * 分页获取角色列表
 * @param {*} query 查询参数，json格式
 */
export function fetchRoleList(query) {
  return request({
    // url: '/upms/role',
    url: '/upms/role/nodePath',
    method: 'get',
    params: query
  })
}

/**
 * 获取所有角色
 */
export function fetchAllRole() {
  return request({
    url: '/upms/role/all',
    method: 'get'
  })
}

/**
 * 根据机构获取所有角色
 */
export function fetchIdRole(nodePath) {
  return request({
    url: `/upms/role/nodePath/${nodePath}`,
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: '/upms/menu/tree',
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/upms/role',
    method: 'post',
    data
  })
}

export function getRoleDetail(id) {
  return request({
    url: `/upms/role/${id}`,
    method: 'get'
  })
}

export function updateRole(data) {
  return request({
    url: '/upms/role',
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/upms/role/${id}`,
    method: 'delete'
  })
}

export function exportRole(id) {
  return request({
    url: '/upms/role/excel',
    method: 'get'
  })
}
