import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const findColumns = () => {
  return axios.req({
    method: 'get',
    url: Api.content.findColumns
  })
}
export const articleList = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.content.articleList
  })
}
export const getSts = () => {
  return axios.req({
    method: 'get',
    url: Api.content.getSts
  })
}
export const modifyArticle = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.content.modifyArticle.concat(id)
  })
}
