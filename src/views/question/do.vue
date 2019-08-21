<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:48:20
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-21 09:35:30
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page question-do" id="question-do">
    <div class="top">
      <span class="wm wm-close" style="margin-right: 10px;"></span>
      <progress-bar :progress="40"></progress-bar>
      <span style="margin-left: 10px;">1/10</span>
    </div>

    <div class="question">
      首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次
      答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首
      次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题
      首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次
      答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首
      次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题首次答题
    </div>

    <div class="tabs" v-show="showTabs">
      <div :class="['tab', showTab('record') ? 'active' : '']" @click="onClickTab('record')">首次答题</div>
      <div
        :class="['tab', showTab('redo_record') ? 'active' : '']"
        v-if="onReason"
        @click="onClickTab('redo_record')"
      >订正答题</div>
      <div :class="['tab', showTab('form') ? 'active' : '']" v-else @click="onClickTab('form')">订正答题</div>
      <div :class="['tab', showTab('reason') ? 'active' : '']" v-if="onReason" @click="onClickTab('reason')">错题总结</div>
    </div>

    <!-- 做题 -->
    <div class="panel step" v-show="showTab('form')">
      <div class="content">
        <span class="tip">在这里写步骤</span>
        <img class="upload" src="../../assets/images/camera.png" alt />
        <span class="clean">清空</span>
        <!-- <drawing-board id="canvas" ref="canvas"></drawing-board> -->
        <draw-panel class="draw-panel"></draw-panel>
      </div>
    </div>

    <div class="panel answer" v-show="showTab('form')">
      <div class="content">
        <span class="tip">在这里写答案</span>
        <span class="clean">清空</span>
        <div ref="editor" id="editor" touch-action="none"></div>
      </div>
      <div class="result">
        {{ '请输入答案，系统自动识别' }}
        <span ref="result"></span>
      </div>
    </div>
    <!-- 做题 -->

    <!-- 首次 -->
    <div class="panel" v-show="showTab('record')">
      <div class="content"></div>
    </div>

    <div class="panel" v-show="showTab('record')">
      <div class="content"></div>
    </div>
    <!-- 首次 -->

    <!-- 订正 -->
    <div class="panel" v-show="showTab('redo_record')">
      <div class="content"></div>
    </div>

    <div class="panel" v-show="showTab('redo_record')">
      <div class="content"></div>
    </div>
    <!-- 订正 -->

    <!-- 原因 -->
    <div class="panel" v-show="showTab('reason')">
      <div class="content"></div>
    </div>

    <div class="panel" v-show="showTab('reason')">
      <div class="content"></div>
    </div>
    <!-- 原因 -->

    <van-button class="submit" block round size="small" type="info">提交答案</van-button>
  </div>
</template>

<script>
import 'pepjs'
import 'katex/dist/katex.min.css'
import katex from 'katex'
import 'myscript/dist/myscript.min.css'
import * as MyScriptJS from 'myscript/dist/myscript.esm'

export default {
  data() {
    return {
      active_tab: 'form',
      show_tabs: false
    }
  },

  created() {
    // this.onTypeInit()
  },

  mounted() {
    this.initMyscript()
  },

  computed: {
    /**
     * @description: 判断是否显示tabs
     * @param {type}
     * @return:
     */
    showTabs() {
      return Boolean(this.$route.query.type)
    },
    /**
     * @description: 判断是否是填写原因
     * @param {type}
     * @return:
     */
    onReason() {
      return this.$route.query.type === 'reason'
    }
  },

  methods: {
    /**
     * @description: 手写板初始化，另外附加监听值
     * @param {type}
     * @return:
     */
    initMyscript() {
      const editorElement = this.$refs.editor
      const resultElement = this.$refs.result
      MyScriptJS.register(editorElement, {
        recognitionParams: {
          type: 'MATH',
          protocol: 'WEBSOCKET',
          apiVersion: 'V4',
          server: {
            scheme: 'https',
            host: 'cloud.myscript.com',
            applicationKey: '3096583b-ab1c-40f7-a814-9a15b709a542',
            hmacKey: 'e3df8899-4250-40c9-acf4-baadc4ec93a5'
          },
          v4: {
            alwaysConnected: false,
            math: {
              mimeTypes: ['application/x-latex', 'image/png'],
              margin: {
                bottom: 0,
                left: 0,
                right: 0,
                top: 0
              }
            }
          }
        }
      })
      window.addEventListener('resize', function() {
        editorElement.editor.resize()
      })
      editorElement.addEventListener('exported', function(editor) {
        const exports = editor.detail.exports
        if (exports && exports['application/x-latex']) {
          katex.render(exports['application/x-latex'], resultElement)
        }
      })
    },
    /**
     * @description: 根据tab处理数据初始化
     * @param {type}
     * @return:
     */
    onTypeInit() {
      switch (this.$route.query.type) {
        case 'redo':
          this.active_tab = 'form'
          this.show_tabs = true
          break
        case 'reason':
          this.active_tab = 'reason'
          this.show_tabs = true
          break
        default:
          this.active_tab = 'form'
          break
      }
    },
    /**
     * @description: 通过tab_name判断是否显示内容
     * @param {type}
     * @return:
     */
    showTab(tab_name) {
      return this.active_tab === tab_name
    },
    /**
     * @description: 点击切换tab
     * @param {type}
     * @return:
     */
    onClickTab(tab_name) {
      if (tab_name !== this.active_tab) {
        this.active_tab = tab_name
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.question-do {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;

  .top {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 10px;
    background: #fff;

    span {
      font-size: 13px;
    }
  }

  .question {
    display: block;
    overflow: hidden;
    overflow-y: auto;
    flex: 1;
    // height: 75px;
    background: #fff;
    padding: 10px;
    font-size: 13px;
    color: #474e60;
  }

  .tabs {
    padding: 10px 10px 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;

    .tab {
      font-size: 12px;
      padding: 5px 15px;
      border: 1px solid #3296fa;
      border-right: 0;
      color: #3296fa;

      &.active {
        background: #3296fa;
        color: #fff;
      }

      &:first-child {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
      }

      &:last-child {
        border-right: 1px solid #3296fa;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
      }
    }
  }

  .panel {
    margin: 10px 10px 0;
    padding: 10px;
    background: #fff;
    border-radius: 5px;

    .content {
      border: 1px dotted #85a8ff;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      width: calc(100vw - 40px);

      .tip {
        font-size: 10px;
        color: #3296fa;
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
      }

      .upload {
        width: 20px;
        height: 15px;
        position: absolute;
        bottom: 10px;
        left: 10px;
        z-index: 1000;
      }

      .clean {
        font-size: 13px;
        color: #767789;
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 1000;
      }
    }

    .result {
      height: 50px;
      font-size: 12px;
      color: #c1c3cb;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
    }

    &.step {
      .content {
        height: 280px;

        /*iPad 竖屏*/
        @media only screen and (min-device-width: 768px) and (orientation: portrait) {
          height: 150px;
        }
      }
    }

    &.answer {
      padding-bottom: 0;
      margin-bottom: 50px;
      .content {
        height: 80px;
        /*iPad 竖屏*/
        @media only screen and (min-device-width: 768px) and (orientation: portrait) {
          height: 50px;
        }
      }
    }
  }

  .submit {
    width: calc(100% - 20px);
    // margin: 10px;
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
  }

  #editor {
    height: 100%;
    width: 100%;
    z-index: 10;
  }

  .draw-panel {
    height: 100%;
    width: 100%;
    z-index: 10;
  }
}
</style>