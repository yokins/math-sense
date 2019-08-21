<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-20 16:29:29
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-21 09:17:41
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <canvas id="canvas" v-on:touchstart="touchstart" v-on:touchend="touchend" v-on:touchmove="touchmove"></canvas>
</template>

<script>
export default {
  data: function() {
    return {
      mouse: {
        current: {
          x: 0,
          y: 0
        },
        previous: {
          x: 0,
          y: 0
        },
        down: false
      }
    }
  },
  computed: {
    currentMouse: function() {
      var c = document.getElementById('canvas')
      var rect = c.getBoundingClientRect()
      console.log('TCL: rect', rect)

      return {
        x: this.mouse.current.x - rect.left,
        y: this.mouse.current.y - rect.top
      }
    }
  },
  methods: {
    draw: function(event) {
      // requestAnimationFrame(this.draw);
      if (this.mouse.down) {
        var c = document.getElementById('canvas')

        const width = c.width
        const height = c.height

        var ctx = c.getContext('2d')

        ctx.clearRect(0, 0, width, height)

        ctx.lineTo(this.currentMouse.x, this.currentMouse.y)

        ctx.strokeStyle = '#474E60'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    },
    touchstart: function(event) {
      console.log('TCL: event', event)
      this.mouse.down = true
      this.mouse.current = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY
      }

      var c = document.getElementById('canvas')
      var ctx = c.getContext('2d')

      ctx.moveTo(this.currentMouse.x, this.currentMouse.y)
    },
    touchend: function() {
      this.mouse.down = false
    },
    touchmove: function(event) {
      console.log('TCL: event', event)

      // this.mouse.current = {
      //   x: event.pageX,
      //   y: event.pageY
      // }

      this.mouse.current = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY
      }

      this.draw(event)
    }
  },
  ready: function() {
    var c = document.getElementById('canvas')
    var ctx = c.getContext('2d')
    ctx.translate(0.5, 0.5)
    ctx.imageSmoothingEnabled = false
  }
}
</script>