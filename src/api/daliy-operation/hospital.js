import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const findHospitals = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.hospital.findHospitals
  })
}
export const searchHospitals = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.hospital.searchHospitals
  })
}
export const deleteHospital = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.hospital.deleteHospital.concat(id)
  })
}
export const createHospital = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.hospital.createHospital
  })
}
export const modifyHospital = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.hospital.modifyHospital.concat(id)
  })
}
