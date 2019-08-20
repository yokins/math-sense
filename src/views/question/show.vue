<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:48:20
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-20 13:59:50
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page question-do" id="question-do">
    <div class="top">
      <van-icon class-prefix="wm" name="close" style="font-size: 13px;margin-right: 10px;"></van-icon>
    </div>

    <div class="question"></div>

    <div class="tabs">
      <div :class="['tab', showTab('record') ? 'active' : '']" @click="onClickTab('record')">首次答题</div>
      <div :class="['tab', showTab('form') ? 'active' : '']" @click="onClickTab('form')">订正答题</div>
      <div :class="['tab', showTab('reason') ? 'active' : '']" @click="onClickTab('reason')">错题总结</div>
    </div>

    <!-- 首次 -->
    <div class="panel step" v-show="showTab('record')">
      <div class="content"></div>
    </div>

    <div class="panel answer" v-show="showTab('record')">
      <div class="content"></div>
    </div>
    <!-- 首次 -->

    <!-- 做题 -->
    <div class="panel step" v-show="showTab('form')">
      <div class="content"></div>
    </div>

    <div class="panel answer" v-show="showTab('form')">
      <div class="content"></div>
    </div>
    <!-- 做题 -->

    <!-- 原因 -->
    <div class="panel step" v-show="showTab('reason')">
      <div class="content"></div>
    </div>

    <div class="panel answer" v-show="showTab('reason')">
      <div class="content"></div>
    </div>
    <!-- 原因 -->

    <van-button class="submit" block round size="small" type="info">提交答案</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active_tab: 'form',
      show_tabs: false
    }
  },

  created() {
    this.onTypeInit()
  },

  computed: {
    /**
     * @description: 判断是否显示tabs
     * @param {type}
     * @return:
     */
    showTabs() {
      return this.active_tab !== 'form'
    }
  },

  methods: {
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


<style lang="scss">
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
      margin-left: 10px;
    }
  }

  .question {
    flex: 1;
    background: #fff;
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
      padding: 10px;
      border-radius: 5px;
    }

    &.step {
      .content {
        height: 270px;

        /*iPad 竖屏*/
        @media only screen and (min-device-width: 768px) and (orientation: portrait) {
          height: 135px;
        }
      }
    }

    &.answer {
      .content {
        height: 80px;
        /*iPad 竖屏*/
        @media only screen and (min-device-width: 768px) and (orientation: portrait) {
          height: 40px;
        }
      }
    }
  }

  .submit {
    width: calc(100% - 20px);
    margin: 10px;
  }
}
</style>