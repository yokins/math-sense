/*
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 16:37:29
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-21 15:39:07
 * @Incantation: Buddha Bless Do Not Bugs
 */

import basic from './basic'

export default {
  /**
   * @description: 练习状态刷选
   * @param {type}
   * @return:
   */
  homeworkStatus(key) {
    const obj = basic.homeworkStatus.filter(item => {
      return item.key === key
    })[0]

    return obj ? obj.text : '未知状态'
  },

  /**
   * @description: 题目状态刷选
   * @param {type}
   * @return:
   */
  homeworkQuestionStatus(key) {
    const obj = basic.homeworkQuestionStatus.filter(item => {
      return item.key === key
    })

    return obj ? obj.text : '未知状态'
  }
}