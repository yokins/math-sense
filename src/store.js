/*
 * @Author: yokins·shi(施永坚)
 * @Description: 改革春风吹满地，搬起砖来不吃力
 * @Date: 2019-08-16 13:58:40
 * @LastEditTime: 2019-08-19 10:30:04
 */
import Vue from 'vue'
import Vuex from 'vuex'
import util from './configs/util'
Vue.use(Vuex)

const types = {
  SET_STATE: 'SET_STATE'
}

export default new Vuex.Store({
  state: {
    current_user: util.storage.get('math-sense-current-user')
  },

  actions: {
    /**
     * @description: 登录保存用户
     * @param {type}
     * @return:
     */
    set_current_user({ commit }, payload) {
      util.storage.set('math-sense-current-user', payload)
      commit(types.SET_STATE, { key: 'current_user', value: payload })
    },
    /**
     * @description: 注销删除用户
     * @param {type}
     * @return:
     */
    clean_current_user({ commit }) {
      util.storage.delete('math-sense-current-user')
      commit(types.SET_STATE, { key: 'current_user', value: null })
    }
  },

  mutations: {
    /**
     * @description: 更新state的通用方法
     * @param {type}
     * @return:
     */
    [types.SET_STATE](state, payload) {
      state[payload.key] = payload.value
    }
  }
})
