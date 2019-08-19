/*
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 16:37:16
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-19 10:16:05
 * @Incantation: Buddha Bless Do Not Bugs
 */
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Toast } from 'vant'
import Vue from 'vue'

const config = {
  baseURL: process.env.VUE_APP_API_URL
}

// alert(config.baseURL)

let http = axios.create(config)

http.interceptors.request.use(
  function(config) {
    if (store.state.current_user && store.state.current_user.token)
      config.headers['TOKEN'] = store.state.current_user.token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  function(response) {
    if (response.data.errcode === 0) {
      return response.data
    } else {
      Toast({
        position: 'top',
        duration: 2000,
        message: response.data.message ? response.data.message : '服务器连接失败，请重试！'
      })
      return Promise.reject(response.data)
    }
  },
  function(error) {
    if (error.response.status === 401) {
      console.log(store)
      Toast({
        position: 'top',
        duration: 1000,
        message: '用户信息失效，请重新登录！'
      })
      store.dispatch('clean_current_user')
      router.replace({ name: 'login' })
    } else {
      Toast({
        position: 'top',
        duration: 1000,
        message: '当前网络情况比较差，请保持网络顺畅！'
      })
    }
    return Promise.reject(error)
  }
)

export default http
Vue.prototype.$http = http
