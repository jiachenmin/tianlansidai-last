import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const getGroups = () => {
  return axios.req({
    method: 'get',
    url: Api.groupsCenter.getGroups
  })
}
export const getTerms = (id, params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.groupsCenter.getTerms.concat(id)
  })
}
export const createGroup = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.groupsCenter.createGroup
  })
}
export const modifyGroup = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.groupsCenter.modifyGroup.concat(id)
  })
}
export const deleteGroup = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.groupsCenter.deleteGroup.concat(id)
  })
}
export const searchTerms = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.groupsCenter.searchTerms
  })
}
export const modifyTerm = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.groupsCenter.modifyTerm.concat(id)
  })
}
export const createTerm = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.groupsCenter.createTerm
  })
}
export const deleteTerm = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.groupsCenter.deleteTerm.concat(id)
  })
}
