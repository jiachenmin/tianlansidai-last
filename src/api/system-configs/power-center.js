import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const createRole = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.powerCenter.createRole
  })
}
export const getRole = () => {
  return axios.req({
    // params,
    method: 'get',
    url: Api.powerCenter.getRole
  })
}
export const getPermissionList = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.powerCenter.getPermissionList
  })
}
export const deleteRole = (params) => {
  return axios.req({
    method: 'delete',
    url: Api.powerCenter.deleteRole.concat(params)
  })
}
export const modifyRole = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.powerCenter.deleteRole.concat(id)
  })
}
export const modifyPermission = (id, params) => {
  return axios.req({
    params,
    method: 'put',
    url: Api.powerCenter.modifyPermission.concat(id)
  })
}
export const deletePermission = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.powerCenter.deletePermission.concat(id)
  })
}
export const createPermission = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.powerCenter.createPermission
  })
}
