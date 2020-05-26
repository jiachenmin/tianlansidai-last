import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const getMetadataType = () => {
  return axios.req({
    method: 'get',
    url: Api.rootCenter.getMetadataType
  })
}
export const metadataList = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.rootCenter.metadataList
  })
}
export const operatingMetadata = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.rootCenter.operatingMetadata.concat(id)
  })
}
export const createMetadataType = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.rootCenter.createMetadataType
  })
}
export const operatingMetadataType = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.rootCenter.operatingMetadataType.concat(id)
  })
}
export const deleteMetadataType = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.rootCenter.deleteMetadataType.concat(id)
  })
}
export const createMetadata = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.rootCenter.createMetadata
  })
}
export const deleteMetadata = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.rootCenter.deleteMetadata.concat(id)
  })
}
