/*
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 13:58:40
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-09-10 18:48:28
 * @Incantation: Buddha Bless Do Not Bugs
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    // 'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
