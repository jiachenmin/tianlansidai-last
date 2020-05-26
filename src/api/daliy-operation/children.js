import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const listChild = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.children.listChild
  })
}
export const listAllSchool = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.children.listAllSchool
  })
}
