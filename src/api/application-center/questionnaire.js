import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const getQuestionnaires = () => {
  return axios.req({
    method: 'get',
    url: Api.questionCenter.getQuestionnaires
  })
}
export const getSubjects = (id, params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.questionCenter.getSubjects.concat(id)
  })
}
export const createQuestionnaire = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.questionCenter.createQuestionnaire
  })
}
export const modifyQuestionnaire = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.questionCenter.modifyQuestionnaire.concat(id)
  })
}
export const deleteQuestionnaire = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.questionCenter.deleteQuestionnaire.concat(id)
  })
}
export const modifySubject = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.questionCenter.modifySubject.concat(id)
  })
}
export const searchSubjects = (params) => {
  return axios.req({
    params,
    method: 'post',
    url: Api.questionCenter.searchSubjects
  })
}
export const createSubject = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.questionCenter.createSubject
  })
}
export const deleteSubject = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.questionCenter.deleteSubject.concat(id)
  })
}
