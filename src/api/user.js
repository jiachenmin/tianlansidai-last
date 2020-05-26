import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password
  }
  return axios.req({
    url: Api.user.login,
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.req({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.req({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.req({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.req({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.req({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.req({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.req({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.req({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
