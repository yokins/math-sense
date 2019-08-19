/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-16 13:58:40
 * @LastEditTime: 2019-08-19 09:24:05
 * @LastEditors: 施永坚（yokins）
 */
import 'normalize.css'
import './assets/styles/iconfonts/iconfont.css'
import 'vant/lib/index.css'
import './assets/styles/global.scss'
import 'amfe-flexible'
import Vue from 'vue'
import Vant from 'vant'
import App from './layouts/app.vue'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
Vue.use(Vant)

Vue.config.productionTip = false

if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded',
    function() {
      FastClick.attach(document.body)
    },
    false
  )
}

document.addEventListener(
  'deviceready',
  function() {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  },
  false
)
