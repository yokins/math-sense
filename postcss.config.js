/*
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 13:58:40
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-26 10:47:16
 * @Incantation: Buddha Bless Do Not Bugs
 */
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
