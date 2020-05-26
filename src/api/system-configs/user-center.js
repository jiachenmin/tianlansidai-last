import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const findAdmins = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.userCenter.findAdmins
  })
}
export const organizationTrees = () => {
  return axios.req({
    method: 'get',
    url: Api.userCenter.organizationTrees
  })
}
export const createOrganization = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.userCenter.createOrganization
  })
}
export const createAdmin = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.userCenter.createAdmin
  })
}
export const modifyOrganization = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.userCenter.modifyOrganization.concat(id)
  })
}
export const deleteOrganization = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.userCenter.deleteOrganization.concat(id)
  })
}
export const modifyAdmin = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.userCenter.modifyAdmin.concat(id)
  })
}
export const deleteAdmin = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.userCenter.deleteAdmin.concat(id)
  })
}
