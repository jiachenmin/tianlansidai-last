import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const findRooms = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.smallRoom.findRooms
  })
}
export const searchRooms = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.smallRoom.searchRooms
  })
}
export const createRoom = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.smallRoom.createRoom
  })
}
export const deleteRoom = (id, params) => {
  return axios.req({
    data: params,
    method: 'delete',
    url: Api.smallRoom.deleteRoom.concat(id)
  })
}
export const modifyRoom = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.smallRoom.modifyRoom.concat(id)
  })
}
