import axios from 'axios'
import dayjs from 'dayjs'
import store from '@/store'
import Router from 'vue-router'
import { getToken, removeToken, storeData } from './util'

// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

// 新增ApiCaller类 内部函数为老项目的几个方法
class ApiCaller {
  prefixInteger (num, length) {
    return (Array(length).join('0') + num).slice(-length)
  }
  getSequenceNumber () {
    let sn = storeData.getItem('sn')
    if (!sn) {
      sn = 0
    }
    sn = parseInt(sn, 10)
    if (sn > 100000) {
      sn = 0
    }
    sn += 1
    storeData.setItem('sn', sn)
    return this.prefixInteger(sn, 5)
  }
  getTimestamp () {
    return (new Date()).getTime()
  }
  getToInjectParams (purpose) {
    const timestampWithSn = `${this.getTimestamp()}${this.getSequenceNumber()}`
    const prefix = 'AZURE-RiBBON-WEB'
    return {
      token: getToken(),
      requestId: `${prefix}-${purpose || 'REQUEST'}-${timestampWithSn}`,
      traceId: `${prefix}-${purpose || 'TRACE'}-${timestampWithSn}`
    }
  }
  getInjectedParams (props, purpose) {
    let injectedPrams = ''
    if (!props || Object.keys(props).length <= 0) {
      injectedPrams = this.getToInjectParams(purpose)
    } else {
      injectedPrams = Object.assign(props, this.getToInjectParams(purpose))
    }
    return injectedPrams
  }
}

// 通过继承的方法 继承父类ApiCaller的方法
class HttpRequest extends ApiCaller {
  constructor (baseUrl = baseURL) {
    super()
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      const token = getToken()
      // 拦截请求并获取token设置到请求头上
      if (token) {
        Object.assign(config.headers, { 'x-access_token': token })
      }
      // eslint-disable-line
      // console.log('requset =>', config)
      this.queue[url] = true
      return config
    }, error => Promise.reject(error))
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      // TODO: 模拟原项目响应数据格式，接正式接口请删除！！！
      const mockParams = {
        stateCode: 1,
        stateDesc: null,
        stateDetail: null,
        success: true,
        respTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        traceId: JSON.parse(res.config.data).traceId
      }
      // 增加如果状态code为7的话 则重定向到登录页面
      if (data && data.stateCode === 7) {
        removeToken()
        Router.replace({
          path: '/login'
        })
      }
      // eslint-disable-line
      // console.log('response =>', res)
      return { data, status, ...mockParams }
    }, error => {
      // eslint-disable-next-line
      console.log(error)
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      const response = {}
      response.data = {
        traceId: '',
        respTime: new Date(),
        success: false,
        stateCode: 500,
        stateDesc: '接口访问失败，请确认网络是否正常，如仍有问题，请与管理员联系。',
        stateDetail: error
      }
      Promise.resolve(response)
      return Promise.reject(error)
    })
  }
  /**
   * 封装Axios的request方法
   * @param {Object} options 请求参数 内置参数如下:
   * options : {
   *   @param {String} url: url地址
   *   @param {Object} data: 请求参数
   *   @param {String} method: 请求方式
   *   @param {Object} headers 需要往请求头放置的参数
   *   @param {String} purpose 发起请求的目的 (比如: GETUSERID)
   * }
   * @memberof HttpRequest
   */
  req (options) {
    const instance = axios.create()
    const { url, data, method, purpose } = options
    const injectedPrams = super.getInjectedParams(data, purpose)
    if (method === 'get') {
      if (url.indexOf('?') < 0) options.url = url.concat('?')
      Object.entries(injectedPrams).forEach((entry) => {
        options.url += `&${entry[0]}=${entry[1]}`
      })
    }
    options.data = injectedPrams
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
