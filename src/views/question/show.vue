<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:48:20
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-09-05 16:15:31
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page question-show" id="question-show">
    <div class="top">
      <span class="wm wm-close" style="margin-right: 10px;" @click="close"></span>
      <!-- <progress-bar :progress="percent"></progress-bar>
      <span style="margin-left: 10px;">{{ currentQuestionIndex }}/{{doing_questions.length}}</span>-->
    </div>

    <div class="question" v-html="question.html"></div>

    <!-- tabs区域 -->
    <div class="tabs">
      <div :class="['tab', showTab('record') ? 'active' : '']" @click="onClickTab('record')">首次答题</div>
      <div v-if="answer_2" :class="['tab', showTab('redo_record') ? 'active' : '']" @click="onClickTab('redo_record')">订正答题</div>
      <div :class="['tab', showTab('reason') ? 'active' : '']" @click="onClickTab('reason')">{{ answer_2 ? '错题总结' : '题目解析' }} </div>
    </div>
    <!-- tabs区域 -->

    <div class="block">
    <!-- 首次 -->
    <div class="panel step" v-show="showTab('record')">
      <div class="content" v-if="answer_1">
        <span class="tip">您的解题步骤</span>
        <img
          v-if="answer_1.attachments[0]"
          :src="answer_1.attachments[0].url"
          class="step-img"
          @click="clickStepImg(answer_1.attachments[0].url)"
        />
      </div>
    </div>

    <div class="panel answer" v-show="showTab('record')">
      <div class="content display" v-if="answer_1 && answer_1.homework_answer_contents[0]">
        <span class="tip">您的答案</span>
        <!-- <vue-mathjax :formula="answer_1.homework_answer_contents[0].content"></vue-mathjax> -->
        <div class="katex-answer" v-if="answer_1.homework_answer_contents[0].content" v-katex="answer_1.homework_answer_contents[0].content"></div>
        <van-icon size="15" v-if="answer_1.homework_answer_contents[0].status === 'wrong'" name="clear" color="#FF7B4D"></van-icon>
        <van-icon size="15" v-else name="checked" color="#3296fa"></van-icon>
      </div>
    </div>
    <!-- 首次 -->

    <!-- 订正 -->
    <div class="panel step" v-if="answer_2" v-show="showTab('redo_record')">
      <div class="content">
        <span class="tip">您的解题步骤</span>
        <img
          v-if="answer_2.attachments[0]"
          :src="answer_2.attachments[0].url"
          class="step-img"
          @click="clickStepImg(answer_2.attachments[0].url)"
        />
      </div>
    </div>

    <div class="panel answer" v-if="answer_2 && answer_2.homework_answer_contents[0]" v-show="showTab('redo_record')">
      <div class="content display">
        <span class="tip">您的答案</span>
        <!-- <vue-mathjax :formula="answer_2.homework_answer_contents[0].content"></vue-mathjax> -->
        <div class="katex-answer" v-if="answer_2.homework_answer_contents[0].content" v-katex="answer_2.homework_answer_contents[0].content"></div>
        <van-icon size="15" v-if="answer_2.homework_answer_contents[0].status === 'wrong'" name="clear" color="#FF7B4D"></van-icon>
        <van-icon size="15" v-else name="checked" color="#3296fa"></van-icon>
      </div>
    </div>
    <!-- 订正 -->

    <!-- 原因 -->
    <div class="panel panel-answer" v-show="showTab('reason')">
      <div class="content">
        <span>正确解析</span>
        <div class="question-analyze" v-if="question.question_analyze" v-html="question.question_analyze.html"></div>
        <span>正确答案</span>
        <div class="question-answer" v-if="question.question_answers && question.question_answers[0]">
          <!-- <vue-mathjax v-for="(item, index) in question.question_answers" :key="index" :formula="item.content"></vue-mathjax> -->
          <div
            v-for="(item, index) in question.question_answers[0].question_answer_contents"
            :key="index"
          >
            <div class="katex-answer" v-katex="item.content"></div>
            <span v-if="question.question_answers[0].question_answer_contents.length - 1 !== index"> 、</span>
          </div>
        </div>
      </div>
    </div>

    <div class="panel panel-reason" v-if="answer_2" v-show="showTab('reason')">
      <div class="content">
        <span>你总结的错误原因</span>
        <div class="checkboxs">
          <div v-for="(item, index) in student_summaries" :key="index" :class="['tag', 'selected']">{{item.tag.content}}</div>
        </div>
        <div class="checkboxs" v-if="student_summaries_content">{{ student_summaries_content }}</div>
      </div>
    </div>

    <div class="panel panel-reason" v-if="answer_2" v-show="showTab('reason')">
      <div class="content">
        <span>老师总结的错误原因</span>
        <div class="checkboxs">
          <div v-for="(item, index) in teacher_summaries" :key="index" :class="['tag', 'selected']">{{item.tag.content}}</div>
        </div>
        <div class="checkboxs" v-if="teacher_summaries_content">{{ teacher_summaries_content }}</div>
      </div>
    </div>
    <!-- 原因 -->
    </div>
  </div>
</template>

<script>
import 'pepjs'
import 'katex/dist/katex.min.css'
// import katex from 'katex'
// import 'myscript/dist/myscript.min.css'
// import * as MyScriptJS from 'myscript/dist/myscript.esm'
import { mapState, mapActions } from 'vuex'
import { ImagePreview } from 'vant'
// import upload from '../../configs/upload'
// import { VueMathjax } from 'vue-mathjax'

export default {
  data() {
    return {
      active_tab: 'record',
      show_tabs: false,
      question: {},
      homework_answers: [],
      student_summaries: [],
      teacher_summaries: [],
      drawed: false,
      result: '',
      step: '',
      reason: [],
      other: '',
      tags: [],
      selected_tags: []
    }
  },

  created() {
    this.initTags()
    this.init(this.$route.params.question_id)
  },

  mounted() {},

  computed: {
    ...mapState(['doing_questions']),
    /**
     * @description: 首次答题的答案
     * @param {type}
     * @return:
     */
    answer_1() {
      if (this.homework_answers) {
        return this.homework_answers[0]
      } else {
        return null
      }
    },
    /**
     * @description: 二次答题的答案
     * @param {type}
     * @return:
     */
    answer_2() {
      if (this.homework_answers) {
        return this.homework_answers[1]
      } else {
        return null
      }
    },
    /**
     * @description: 教师评价
     * @param {type} 
     * @return: 
     */
    teacher_summaries_content() {
      // if (this.teacher_summaries.length > 0) {
      //   const list = this.teacher_summaries.filter(item => {
      //     return item.content !== ''
      //   })

      //   if (list.length > 0) {
      //     return list[0].content
      //   } else {
      //     return false
      //   }
      // } else {
      //   return false
      // }
      return this.teacher_summaries.reduce((content, item) => {
        if (item.content) {
          content = item.content
        }
        return content
      }, '')
    },
    /**
     * @description: 学生评价
     * @param {type} 
     * @return: 
     */
    student_summaries_content() {
      // if (this.student_summaries.length > 0) {
      //   const list = this.student_summaries.filter(item => {
      //     return item.content !== ''
      //   })

      //   if (list.length > 0) {
      //     return list[0].content
      //   } else {
      //     return false
      //   }
      // } else {
      //   return false
      // }

      return this.student_summaries.reduce((content, item) => {
        if (item.content) {
          content = item.content
        }
        return content
      }, '')
    }
  },

  methods: {
    /**
     * @description: 初始化错误原因
     * @param {type}
     * @return:
     */
    initTags() {
      this.$api.question_tags().then(res => {
        this.tags = res.tags
      })
    },
    /**
     * @description:
     * @param {type}
     * @return:
     */
    close() {
      if (this.$route.query.type === 'back') {
        this.$router.go(-1)
      } else {
        this.$router.replace({ name: 'home' })
      }
    },
    /**
     * @description: 获取题目信息
     * @param {type}
     * @return:
     */
    init(id) {
      this.$api.get_question({ id: id, homework_id: this.$route.params.homework_id }).then(res => {
        this.question = res.homework_question.question
        this.homework_answers = res.homework_question.homework_answers
        this.student_summaries = res.homework_question.student_summaries
        this.teacher_summaries = res.homework_question.teacher_summaries
      })
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
    },
    /**
     * @description: 预览图片
     * @param {type}
     * @return:
     */
    clickStepImg(url) {
      ImagePreview([url])
    },
  }
}
</script>


<style lang="scss">
.question-show {
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
    max-height: 300px;
    // flex: 1;
    // height: 75px;
    background: #fff;
    padding: 10px;
    font-size: 13px;
    color: #474e60;
    float: left;
    flex-flow: row wrap;
    align-items: center;
    p {
      margin: 0 !important;
    }
  }

  .tabs {
    padding: 10px 10px 0;
    margin-bottom: 10px;
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


  .block {
    flex: 1;
    // padding: 10px;
    display: block;
    overflow: hidden;
    overflow-y: scroll;
  }

  .panel {
    margin: 0 10px;
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
      margin-bottom: 10px;
      .content {
        height: 280px;

        .step-img {
          margin: 40px 10px 0;
          width: 130px;
          height: 180px;
          border-radius: 10px;
        }

        /*iPad 竖屏*/
        @media only screen and (min-device-width: 768px) and (orientation: portrait) {
          height: 150px;

          .step-img {
            margin: 30px 10px 0;
            width: 60px;
            height: 90px;
          }
        }
      }
    }

    &.answer {
      margin-bottom: 10px;
      .content {
        height: 80px;

        &.display {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          padding-left: 20px;
          width: calc(100% - 20px);
          color: #767789 !important;
        }
        // /*iPad 竖屏*/
        // @media only screen and (min-device-width: 768px) and (orientation: portrait) {
        //   height: 80px;
        // }
      }
    }

    &.panel-answer {
      .content {
        height: 100px;
        overflow-y: auto;
        display: flex;
        flex-flow: column nowrap;
        padding: 10px;
        width: calc(100% - 20px);
        margin-bottom: 10px;

        span {
          font-size: 11px;
          color: #474e60;
        }

        .question-analyze {
          background: #fff;
          padding: 10px;
          font-size: 13px;
          color: #474e60;
          float: left;
          flex-flow: row wrap;
          align-items: center;
          p {
            margin: 0 !important;
          }
        }

        /*iPad 竖屏*/
        @media only screen and (min-device-width: 768px) and (orientation: portrait) {
          height: 80px;

          .step-img {
            margin: 30px 10px 0;
            width: 60px;
            height: 90px;
          }
        }
      }
    }

    &.panel-reason {
      margin-bottom: 0;
      &:last-child {
        margin-bottom: 10px;
      }
      .content {
        min-height: 80px;
        padding: 10px;
        width: calc(100% - 20px);
        display: flex;
        flex-flow: column nowrap;
        margin-bottom: 10px;

        span {
          font-size: 11px;
          color: #474e60;
        }

        .checkboxs {
          margin-top: 10px;
          display: flex;
          flex-flow: row nowrap;
          font-size: 11px;
          .tag {
            width: 70px;
            height: 25px;
            font-size: 11px;
            color: #767789;
            background: #f4f5f7;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            margin-bottom: 10px;
            border-radius: 3px;

            &.selected {
              background: #ff7b4d;
              color: #fff;
            }
          }
        }
      }
    }
  }

  .submit {
    width: calc(100% - 20px);
    margin: 0 10px 10px;

    // // margin: 10px;
    // position: absolute;
    // bottom: 10px;
    // left: 10px;
    // right: 10px;
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

  .result-element {
    color: #3296fa !important;
    font-size: 14px !important;
  }
   
  .katex-answer {
    font-size: 14px !important;
  }

  .question-answer {
    display: flex;
    padding: 10px 10px 0;
    >div{
      display: flex;
    }
  }
}
</style>