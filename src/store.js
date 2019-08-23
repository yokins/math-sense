/*
 * @Author: yokins·shi(施永坚)
 * @Description: 改革春风吹满地，搬起砖来不吃力
 * @Date: 2019-08-16 13:58:40
 * @LastEditTime: 2019-08-23 09:17:19
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
    current_user: util.storage.get('math-sense-current-user'),
    doing_questions: util.storage.get('math-sense-current-doing-questions')
  },

  getters: {
    /**
     * @description: 开始练习时候的状态判断
     * @param {type}
     * @return:
     */
    startPath(state) {
      const questions = state.doing_questions ? state.doing_questions : []
      // todo 检查是否有需要填写原因的题目并且返回第一个id
      const hadDoQuestions = questions.some(item => {
        return item.status === 'wrong' || item.status === 'init'
      })
      if (!hadDoQuestions) {
        return { status: 'judge' }
      }
      // 检查是否有订正的题目并且返回第一个id
      const redoQuestion = questions.filter(item => {
        return item.status === 'wrong'
      })[0]
      if (redoQuestion) {
        return { status: 'redo', id: redoQuestion.id }
      }
      // 检查是否有状态为init的题目并且返回第一个id
      const initQuestion = questions.filter(item => {
        return item.status === 'init'
      })[0]
      if (initQuestion) {
        return { status: 'do', id: initQuestion.id }
      }
    }
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
    },
    /**
     * @description: 设置当前练习所做的题目简易信息
     * @param {type}
     * @return:
     */
    set_doing_question({ commit }, payload) {
      util.storage.set('math-sense-current-doing-questions', payload)
      commit(types.SET_STATE, { key: 'doing_questions', value: payload })
    },
    /**
     * @description: 删除当前练习所做的题目简易信息
     * @param {type}
     * @return:
     */
    clean_doing_question({ commit }) {
      util.storage.delete('math-sense-current-doing-questions')
      commit(types.SET_STATE, { key: 'doing_questions', value: [] })
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
