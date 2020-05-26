import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const surveyStudentStatistics = (id) => {
  return axios.req({
    method: 'get',
    url: Api.survey_result.surveyStudentStatistics.concat(id + '/statistics')
  })
}
