<template>
  <canvas id="draw-board" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove"></canvas>
</template>

<script>
export default {
  data() {
    return {
      canvas: '', //
      context: '', //
      drawing: false, // 是否正在绘画
      lastPoint: { x: 0, y: 0 },
      radius: 0.5,
      lineWidth: 1,
      eraserEnabled: false // 是否开启了橡皮檫的功能
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    exportImg() {
      const canvas = document.getElementById('draw-board')
      return new Promise((resolve) => {
         canvas.toBlob(function(blob) {
           resolve(blob)
        }, 'image/png', 1)
      })
    },
    /**
     * @description: 初始化
     * @param {type}
     * @return:
     */
    init() {
      this.canvas = document.getElementById('draw-board');
      this.context = this.canvas.getContext('2d');
      this.resetSize();
    },
    /**
     * @description: 重新设置canvas背景颜色
     * @param {type}
     * @return:
     */
    setCanvasBg(color) {
      this.context.fillStyle = color;
      this.context.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
    },
    /**
     * @description: 重置尺寸
     * @param {type}
     * @return:
     */
    resetSize() {
      this.canvasResetSize();
      window.addEventListener('resize', function() {
        this.canvasResetSize();
      });
    },
    /**
     * @description: canvas重置尺寸
     * @param {type}
     * @return:
     */
    canvasResetSize() {
      let imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
      this.context.putImageData(imgData, 0, 0);
    },
    /**
     * @description: 使用橡皮擦
     * @param {type}
     * @return:
     */
    useEraser(enable = false) {
      this.eraserEnabled = enable;
    },
    /**
     * @description: 获取点
     * @param {type}
     * @return:
     */
    getPoint(event) {
      const touch = event.targetTouches[0];
      const react = this.canvas.getBoundingClientRect();
      return { x: touch.pageX - react.left, y: touch.pageY - react.top };
    },
    /**
     * @description: 开始触摸
     * @param {type}
     * @return:
     */
    touchstart(event) {
      this.drawing = true;
      this.lastPoint = this.getPoint(event);
      console.log(`是否在绘画状态：${this.drawing} \\\ 是否是橡皮檫: ${this.eraserEnabled}`);
      if (this.eraserEnabled) {
        this.eraserCircle();
      } else {
        this.drawCircle();
      }
    },
    /**
     * @description: 正在触摸
     * @param {type}
     * @return:
     */
    touchmove(event) {
      if (this.drawing) {
        const newPoint = this.getPoint(event);
        if (this.eraserEnabled) {
          console.log('进入');
          this.eraserLine(newPoint);
          this.lastPoint = newPoint;
        } else {
          this.drawLine(newPoint);
          this.lastPoint = newPoint;
        }
      }
    },
    /**
     * @description: 触摸结束
     * @param {type}
     * @return:
     */
    touchend() {
      this.drawing = false;
    },
    /**
     * @description: 画点函数
     * @param {type}
     * @return:
     */
    drawCircle() {
      // 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
      this.context.beginPath();
      // 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），
      // 从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
      this.context.arc(this.lastPoint, this.lastPoint, this.radius, 0, Math.PI * 2);
      // 通过填充路径的内容区域生成实心的图形
      this.context.fill();
      // 闭合路径之后图形绘制命令又重新指向到上下文中。
      this.context.closePath();
    },
    /**
     * @description: 画线函数
     * @param {type}
     * @return:
     */
    drawLine(newPoint) {
      this.context.beginPath();
      // 设置线条宽度
      this.context.lineWidth = this.lineWidth;
      // 设置线条末端样式。
      this.context.lineCap = 'round';
      // 设定线条与线条间接合处的样式
      this.context.lineJoin = 'round';
      // moveTo(x,y)将笔触移动到指定的坐标x以及y上
      this.context.moveTo(this.lastPoint.x, this.lastPoint.y);
      // lineTo(x, y) 绘制一条从当前位置到指定x以及y位置的直线
      this.context.lineTo(newPoint.x, newPoint.y);
      // 通过线条来绘制图形轮廓
      this.context.stroke();
      this.context.closePath();
    },
    /**
     * @description: 擦除时第一个动作6
     * @param {type}
     * @return:
     */
    eraserCircle() {
      this.context.save();
      this.context.globalCompositeOperation = 'destination-out';
      this.context.beginPath();
      this.context.arc(this.lastPoint.x, this.lastPoint.y, 10, 0, 2 * Math.PI);
      this.context.clip();
      this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
      this.context.restore();
    },
    /**
     * @description: 擦除痕迹
     * @param {type}
     * @return:
     */
    eraserLine(newPoint) {
      this.context.save();
      this.context.globalCompositeOperation = 'destination-out';
      this.context.beginPath();
      this.context.arc(newPoint.x, newPoint.y, 10, 0, 2 * Math.PI);
      this.context.clip();
      this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
      this.context.restore();
      // const { x1, y1 } = this.lastPoint;
      // const { x2, y2 } = newPoint;
      // //获取两个点之间的剪辑区域四个端点
      // var asin = 5 * Math.sin(Math.atan((y2 - y1) / (x2 - x1)));
      // var acos = 5 * Math.cos(Math.atan((y2 - y1) / (x2 - x1)));
      // var x3 = x1 + asin;
      // var y3 = y1 - acos;
      // var x4 = x1 - asin;
      // var y4 = y1 + acos;
      // var x5 = x2 + asin;
      // var y5 = y2 - acos;
      // var x6 = x2 - asin;
      // var y6 = y2 + acos; //保证线条的连贯，所以在矩形一端画圆

      // this.context.save();
      // this.context.beginPath();
      // this.context.globalCompositeOperation = 'destination-out';
      // this.context.arc(x2, y2, 5, 0, 2 * Math.PI);
      // this.context.clip();
      // this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
      // this.context.restore(); //清除矩形剪辑区域里的像素

      // this.context.save();
      // this.context.beginPath();
      // this.context.globalCompositeOperation = 'destination-out';
      // this.context.moveTo(x3, y3);
      // this.context.lineTo(x5, y5);
      // this.context.lineTo(x6, y6);
      // this.context.lineTo(x4, y4);
      // this.context.closePath();
      // this.context.clip();
      // this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
      // this.context.restore();
    },
    /**
     * @description: 清空画板
     * @param {type} 
     * @return: 
     */
    clean() {
      this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
      this.context.fillStyle = '#fff';
      this.context.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);  
    }
  }
};
</script>