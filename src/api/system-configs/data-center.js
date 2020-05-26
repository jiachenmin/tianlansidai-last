import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const getDataCenter = () => {
  return axios.req({
    method: 'get',
    url: Api.dataCenter.getDataCenter
  })
}

export const getResourceList = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.dataCenter.getResourceList
  })
}
export const deleteResource = (params) => {
  return axios.req({
    // params,
    method: 'delete',
    url: Api.dataCenter.deleteResource.concat(params)
  })
}
export const addResource = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.dataCenter.addResource
  })
}
export const getSearch = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.dataCenter.getResourceList
  })
}
export const createType = (params) => {
  return axios.req({
    params,
    method: 'post',
    url: Api.dataCenter.createType
  })
}
