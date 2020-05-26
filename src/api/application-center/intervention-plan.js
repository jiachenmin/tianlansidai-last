import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const getInterventionVersion = () => {
  return axios.req({
    method: 'get',
    url: Api.versionCenter.getInterventionVersion
  })
}
export const getInterventions = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.versionCenter.getInterventions
  })
}
export const createInterventionVersion = (params) => {
  return axios.req({
    params,
    method: 'post',
    url: Api.versionCenter.createInterventionVersion
  })
}
export const modifyInterventionVersion = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.versionCenter.modifyInterventionVersion.concat(id)
  })
}
export const deleteInterventionVersion = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.versionCenter.deleteInterventionVersion.concat(id)
  })
}
export const modifyIntervention = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.versionCenter.modifyIntervention.concat(id)
  })
}
export const createIntervention = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.versionCenter.createIntervention
  })
}
export const deleteIntervention = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.versionCenter.deleteIntervention.concat(id)
  })
}
