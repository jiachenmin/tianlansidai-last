import axios from '@/libs/api.request'
import Api from '@/api/base/api-config.js'
export const getCouponTypes = () => {
  return axios.req({
    method: 'get',
    url: Api.couponCenter.getCouponTypes
  })
}
export const getCoupons = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.couponCenter.getCoupons
  })
}
export const createCouponType = (params) => {
  return axios.req({
    data: params,
    method: 'post',
    url: Api.couponCenter.createCouponType
  })
}
export const modifyCouponType = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.couponCenter.modifyCouponType.concat(id)
  })
}
export const deleteCouponType = (id) => {
  return axios.req({
    method: 'delete',
    url: Api.couponCenter.deleteCouponType.concat(id)
  })
}
export const modifyCoupon = (id, params) => {
  return axios.req({
    data: params,
    method: 'put',
    url: Api.couponCenter.modifyCoupon.concat(id)
  })
}
export const searchCoupon = (params) => {
  return axios.req({
    params,
    method: 'get',
    url: Api.couponCenter.searchCoupon
  })
}
