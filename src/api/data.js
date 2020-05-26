import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.req({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.req({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.req({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.req({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.req({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.req({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.req({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
