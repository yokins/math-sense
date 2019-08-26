<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-21 09:33:55
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-26 14:12:34
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <canvas id="draw-canvas" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove"></canvas>
</template>

<script>
export default {
  data() {
    return {
      ctx: '',
      point: {
        x: 0,
        y: 0
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * @description: canvas 初始化
     * @param {type}
     * @return:
     */
    init() {
      const canvas = document.getElementById('draw-canvas')
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height
      this.ctx = canvas.getContext('2d')
      // this.ctx.clearRect(0, 0, width, height)
      this.ctx.fillStyle="#fff"
      this.ctx.fillRect(0, 0, width, height)
      this.ctx.strokeStyle = '#000'
      this.ctx.lineWidth = 1
    },
    /**
     * @description: 获取相对坐标
     * @param {type}
     * @return:
     */
    absolutePoint(event) {
      const touch = event.targetTouches[0]
      const canvas = document.getElementById('draw-canvas')
      const react = canvas.getBoundingClientRect()
      this.point = { x: touch.pageX - react.left, y: touch.pageY - react.top }
    },
    /**
     * @description: 绘制
     * @param {type}
     * @return:
     */
    draw() {
      this.ctx.lineTo(this.point.x, this.point.y)
      this.ctx.stroke()
    },
    /**
     * @description: 开始触摸
     * @param {type}
     * @return:
     */
    touchstart(event) {
      this.absolutePoint(event)
      this.ctx.moveTo(this.point.x, this.point.y)
      this.$emit('updateDrawed', true)
    },
    /**
     * @description: 触摸结束
     * @param {type}
     * @return:
     */
    touchend() {},
    /**
     * @description: 触摸移动
     * @param {type}
     * @return:
     */
    touchmove(event) {
      this.absolutePoint(event)
      this.draw(event)
    },
    /**
     * @description: 清空画布
     * @param {type}
     * @return:
     */
    clean() {
      this.init()
      this.$emit('updateDrawed', false)
    },
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    exportImg() {
      const canvas = document.getElementById('draw-canvas')
      return new Promise((resolve) => {
         canvas.toBlob(function(blob) {
           resolve(blob)
        }, 'image/png', 1)
      })
    }
  }
}
</script>