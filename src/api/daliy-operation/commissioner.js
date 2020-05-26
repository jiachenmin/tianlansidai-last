import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const findDoctors = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.commissioner.findDoctors
  })
}
export const searchDoctors = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.commissioner.searchDoctors
  })
}
export const createDoctor = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.commissioner.createDoctor
  })
}
export const deleteDoctor = (id, params) => {
  return axios.req({
    data: params,
    method: 'delete',
    url: Api.commissioner.deleteDoctor.concat(id)
  })
}
export const modifyDoctor = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.commissioner.modifyDoctor.concat(id)
  })
}
