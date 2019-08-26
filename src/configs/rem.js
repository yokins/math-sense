/*
 * @Description:
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-26 10:40:00
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-26 10:41:13
 * @Incantation: Buddha Bless Do Not Bugs
 */
// 基准大小
const baseSize = 32
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  let scale = document.documentElement.clientWidth / 750
  // 设置页面根节点字体大小
  const fontSize = baseSize * Math.min(scale, 2)

  if (document.documentElement.clientWidth > 750) {
    document.documentElement.style.fontSize = fontSize * 0.75 + 'px'
  } else {
    document.documentElement.style.fontSize = fontSize + 'px'
  }
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function() {
  setRem()
}
