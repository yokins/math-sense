/*
 * @Description:
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 16:37:22
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-19 10:15:37
 * @Incantation: Buddha Bless Do Not Bugs
 */

const storage = {
  // 获取本地存储
  get: key => {
    return JSON.parse(window.localStorage.getItem(key))
  },

  // 设置本地存储
  set: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  },

  // 删除本地存储
  delete: key => {
    window.localStorage.removeItem(key)
  },

  clear: () => {
    window.localStorage.clear()
  }
}

export default {
  storage
}
