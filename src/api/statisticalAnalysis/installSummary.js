import request from '@/utils/request'

export function fetchPie(code) {
  let nationality = '610000'
  if (code) nationality = code
  return request({
    url: `/useratio/${nationality}`,
    method: 'get'
  })
}

export function fetchList(param) {
  let nationality = '610000'
  if (param.nationality) nationality = param.nationality
  return request({
    url: `/useratio/${nationality}/list?&current=${param.page}&size=${param.pageSize}`,
    method: 'get'
  })
}

/**
 * 安装率excel
 */
export function Listexcel(param) {
  let nationality = '610000'
  if (param.nationality) nationality = param.nationality
  return request({
    responseType: 'blob',
    url: `/useratio/${nationality}/excel`,
    method: 'get'
  })
}
