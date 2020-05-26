import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const findAreas = () => {
  return axios.req({
    method: 'get',
    url: Api.areaCenter.findAreas
  })
}
export const findTerritories = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.areaCenter.findTerritories
  })
}
export const createArea = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.areaCenter.createArea
  })
}
export const modifyArea = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.areaCenter.modifyArea.concat(id)
  })
}
export const deleteArea = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.areaCenter.modifyArea.concat(id)
  })
}
export const findRegions = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.areaCenter.findRegions
  })
}
export const deleteTerritory = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.areaCenter.deleteTerritory.concat(id)
  })
}
export const createTerritory = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.areaCenter.createTerritory
  })
}
export const modifyTerritory = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.areaCenter.modifyTerritory.concat(id)
  })
}
