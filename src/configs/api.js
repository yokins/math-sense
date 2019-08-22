/*
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 16:37:12
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-22 19:20:13
 * @Incantation: Buddha Bless Do Not Bugs
 */
import http from './http'

const api = {
  /**
   * 登录接口
   *
   * @param { account: '', password: '' } payload
   * @returns { errorcode: '', user: {} }
   */
  login(payload) {
    return http.post('login', payload)
  },
  /**
   * 获取首页的数据
   *
   * @returns { errcode: '', homeworks: [] }
   */
  home(payload) {
    return http.get('homes', { params: payload })
  },

  /**
   * @description: 获取一次的练习信息
   * @param { payload } ID
   * @return:
   */
  get_homework_info(payload) {
    return http.get(`homeworks/${payload}`)
  },
  /**
   * @description: 获取一个题目的信息
   * @param {type} payload { id: xxx, homework_id: xxx }
   * @return:
   */
  get_question(payload) {
    return http.get(`homework_questions/${payload.id}?homework_id=${payload.homework_id}`)
  },
  /**
   * @description: 解答一个题目
   * @param {type} payload { id: xxx, params: xxx }
   * @return:
   */
  answer_question(payload) {
    return http.post(`homework_questions/${payload.id}/answer?homework_id=${payload.homework_id}`, payload.params)
  },
  /**
   * @description: 总结一个题目
   * @param {type} payload { id: xxx, params: xxx }
   * @return:
   */
  summary_question(payload) {
    return http.post(`homework_questions/${payload.id}/summary`, payload.params)
  },
  /**
   * @description: Tag列表
   * @param {type}
   * @return:
   */
  question_tags() {
    return http.get('tags')
  },
  /**
   * @description: 完成练习
   * @param {type}
   * @return:
   */
  complete(payload) {
    return http.put(`homeworks/${payload}/complete`)
  },

  /**
   * @description: 成长树
   * @param {type}
   * @return:
   */
  tree(payload) {
    return http.get(`homeworks`, { params: payload })
  },
  /**
   * @description:
   * @param {type}
   * @return:
   */
  get_mistake(payload) {
    return http.get('homework_questions', { params: payload })
  },
  /**
   * @description: 意见反馈
   * @param {type}
   * @return:
   */
  feedbacks(payload) {
    return http.post('feedbacks', payload)
  },
  /**
   * @description: 获取知识点列表
   * @param {type}
   * @return:
   */
  acknowledges() {
    return http.get('homework_questions/knowledges')
  }
}

export default api
