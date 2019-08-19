/*
 * @Description:
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 16:37:36
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-19 13:41:27
 * @Incantation: Buddha Bless Do Not Bugs
 */
export default {
  /**
   * @description: homework 练习状态
   * @param {type}
   * @return:
   */
  homeworkStatus: [
    { code: 0, key: 'init', text: '新作业' },
    { code: 1, key: 'pending', text: '待批改' },
    { code: 2, key: 'finished', text: '已完成' },
    { code: 3, key: 'doing', text: '进行中' },
    { code: 4, key: 'undo', text: '未练习' }
  ],
  /**
   * @description: homework question 问题状态
   * @param {type}
   * @return:
   */
  homeworkQuestionStatus: [
    { code: 0, key: 'init', text: '新作业' },
    { code: 1, key: 'right', text: '正确' },
    { code: 2, key: 'wrong', text: '错误' },
    { code: 3, key: 'jumped', text: '跳过' }
  ]
}
