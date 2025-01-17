/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-16 13:58:40
 * @LastEditTime: 2019-08-28 08:58:40
 * @LastEditors: 施永坚（yokins）
 */
import 'normalize.css'
import './assets/styles/iconfonts/iconfont.css'
import 'vant/lib/index.css'
import './assets/styles/global.scss'
// import '@/configs/rem'
import 'amfe-flexible'
import Vue from 'vue'
import Vant from 'vant'
import components from './components'
import App from './layouts/app.vue'
import router from './router'
import store from './store'
// import FastClick from 'fastclick'
import util from './configs/util'
import api from './configs/api'
import filter from './configs/filter'
import vueg from 'vueg'
import VueKatex from 'vue-katex'
import './configs/SocialSharing'
Vue.use(VueKatex)
Vue.use(vueg, router, {})
Vue.use(Vant)
Object.keys(components).forEach(item => {
  Vue.component(item, components[item])
})
Object.keys(filter).forEach(item => {
  Vue.filter(item, filter[item])
})
Vue.prototype.$util = util
Vue.prototype.$api = api

Vue.config.productionTip = false
if (process.env.NODE_ENV === 'production') {
  Vue.config.devtools = false
} else {
  Vue.config.devtools = true
}

// if ('addEventListener' in document) {
//   document.addEventListener(
//     'DOMContentLoaded',
//     function() {
//       FastClick.attach(document.body)
//     },
//     false
//   )
// }

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
