import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const surveyMissionList = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.task.surveyMissionList
  })
}
export const modifySurveyMission = (id) => {
  return axios.req({
    method: 'put',
    url: Api.task.modifySurveyMission.concat(id)
  })
}
export const getAllCoupons = () => {
  return axios.req({
    method: 'get',
    url: Api.task.getAllCoupons
  })
}
export const findSchoolsByArea = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.task.findSchoolsByArea
  })
}
export const findDoctorsByArea = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.task.findDoctorsByArea
  })
}
export const createSurveyMission = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.task.createSurveyMission
  })
}
export const deleteMission = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.task.deleteMission.concat(id)
  })
}
