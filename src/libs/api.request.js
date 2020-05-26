import HttpRequest from '@/libs/axios'
import Api from '^'

const baseUrl = Api.path.base

const axios = new HttpRequest(baseUrl)
export default axios
