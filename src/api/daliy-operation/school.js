import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const findSchools = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.school.findSchools
  })
}
export const searchSchools = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.school.searchSchools
  })
}
export const deleteSchool = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.school.deleteSchool.concat(id)
  })
}
export const createSchool = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.school.createSchool
  })
}
export const modifySchool = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.school.modifySchool.concat(id)
  })
}
