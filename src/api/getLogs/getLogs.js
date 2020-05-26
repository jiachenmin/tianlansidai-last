import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const getLogs = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.errorStore.getLogs
  })
}
