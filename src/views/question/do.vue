<template>
  <div class="page question-do" id="question-do">
    <van-popup v-if="onReason" class="close-popup" v-model="show_close" round>
      <div class="title">是否退出总结原因</div>
      <div class="content">退出后当前题目不保留总结原因记录</div>
      <div class="btns">
        <van-button round type="default" plain size="small" @click="$router.replace({ name: 'home' })">确认退出</van-button>
        <van-button round type="info" size="small" @click="show_close = false">继续总结</van-button>
      </div>
    </van-popup>
    <van-popup v-else class="close-popup" v-model="show_close" round>
      <div class="title">是否退出答题</div>
      <div class="content">退出后当前题目不保留做题记录</div>
      <div class="btns">
        <van-button round type="default" plain size="small" @click="$router.replace({ name: 'home' })">确认退出</van-button>
        <van-button round type="info" size="small" @click="show_close = false">继续练习</van-button>
      </div>
    </van-popup>
    <div class="top">
      <span class="wm wm-close" style="margin-right: 10px;" @click="close"></span>
      <progress-bar :progress="percent"></progress-bar>
      <span style="margin-left: 10px;">{{ currentQuestionIndex }}/{{currentQuestions.length}}</span>
    </div>

    <div class="question" v-html="question.html"></div>

    <!-- tabs区域 -->
    <div class="tabs" v-show="showTabs">
      <div :class="['tab', showTab('record') ? 'active' : '']" @click="onClickTab('record')">首次答题</div>
      <div
        :class="['tab', showTab('redo_record') ? 'active' : '']"
        v-if="onReason && homework_answers.length > 1"
        @click="onClickTab('redo_record')"
      >订正答题</div>
      <div
        :class="['tab', showTab('form') ? 'active' : '']"
        v-if="!onReason && homework_answers.length > 0"
        @click="onClickTab('form')"
      >订正答题</div>
      <div :class="['tab', showTab('reason') ? 'active' : '']" v-if="onReason" @click="onClickTab('reason')">错题总结</div>
    </div>
    <!-- tabs区域 -->

    <div class="block" id="block-panel">
      <!-- 做题 -->
      <!-- @touchstart="lockBlock" @touchend="unlockBlock" -->
      <div class="panel step" v-show="showTab('form')">
        <div class="content">
          <span class="tip">在这里写步骤</span>
          <img class="upload" src="../../assets/images/camera.png" @click="uploadImg" />
          <span class="clean" @click="cleanStep">清空</span>
          <img v-if="step" :src="step" class="step-img" @click="clickStepImg(step)" />
          <draw-panel v-else class="draw-panel" ref="draw" @updateDrawed="updateDrawed"></draw-panel>
        </div>
      </div>  

      <!-- @touchstart="lockBlock" @touchend="unlockBlock" -->
      <div class="panel answer" v-show="showTab('form')">
        <div class="content">
          <span class="tip">在这里写答案</span>
          <span class="clean" @click="cleanResult">清空</span>
          <div ref="editor" id="editor" touch-action="none"></div>
        </div>
        <div class="result">
          {{ result ? '系统识别您的答案为：' : '请输入答案，系统自动识别' }}
          <span
            class="result-element"
            v-if="result"
            ref="result"
            v-katex="result"
          ></span>
        </div>
      </div>
      <!-- 做题 -->

      <!-- 首次 -->
      <div class="panel step" v-show="showTab('record')">
        <div class="content" v-if="answer_1">
          <span class="tip">您的解题步骤</span>
          <img
            v-if="answer_1.attachments[0] && answer_1.attachments[0].url"
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
          <div
            class="katex-answer"
            v-if="answer_1.homework_answer_contents[0].content"
            v-katex="answer_1.homework_answer_contents[0].content"
          ></div>
          <van-icon
            size="15"
            v-if="answer_1.homework_answer_contents[0].status === 'wrong'"
            name="clear"
            color="#FF7B4D"
          ></van-icon>
          <van-icon size="15" v-else name="checked" color="#3296fa"></van-icon>
        </div>
      </div>

      <div class="panel panel-reason" v-if="first_student_summaries.length > 0 && showTab('record')">
        <div class="content">
          <span>你总结的错误原因</span>
          <div class="checkboxs">
            <div
              v-for="(item, index) in first_student_summaries"
              :key="index"
              :class="['tag', 'selected']"
            >{{item.tag.content}}</div>
          </div>
          <div
            class="checkboxs"
            style="font-size: 14px;"
            v-if="first_student_summaries_content"
          >{{ first_student_summaries_content }}</div>
        </div>
      </div>
      <!-- 首次 -->

      <!-- 订正 -->
      <div class="panel step" v-show="showTab('redo_record')">
        <div class="content" v-if="answer_2">
          <span class="tip">您的解题步骤</span>
          <img
            v-if="answer_2.attachments[0] && answer_2.attachments[0].url"
            :src="answer_2.attachments[0].url"
            class="step-img"
            @click="clickStepImg(answer_2.attachments[0].url)"
          />
        </div>
      </div>

      <div class="panel answer" v-show="showTab('redo_record')">
        <div class="content display" v-if="answer_2 && answer_2.homework_answer_contents[0]">
          <span class="tip">您的答案</span>
          <!-- <vue-mathjax :formula="answer_2.homework_answer_contents[0].content"></vue-mathjax> -->
          <div
            class="katex-answer"
            v-if="answer_2.homework_answer_contents[0].content"
            v-katex="answer_2.homework_answer_contents[0].content"
          ></div>
          <van-icon
            size="20"
            v-if="answer_2.homework_answer_contents[0].status === 'wrong'"
            name="clear"
            color="#FF7B4D"
          ></van-icon>
          <van-icon size="20" v-else name="checked" color="#3296fa"></van-icon>
        </div>
      </div>
      <!-- 订正 -->

      <!-- 原因 -->
      <div class="panel panel-answer" v-show="showTab('reason') && homework_answers.length > 1">
        <div class="content">
          <span>正确解析</span>
          <div class="question-analyze" v-if="question.question_analyze" v-html="question.question_analyze.html"></div>
          <span>正确答案</span>
          <div class="question-answer" v-if="question.question_answers && question.question_answers[0]">
            <!-- <vue-mathjax v-for="(item, index) in question.question_answers" :key="index" :formula="item.content"></vue-mathjax> -->
            <div
              class="answers"
              v-for="(item, index) in question.question_answers[0].question_answer_contents"
              :key="index"
            >
              <div class="katex-answer" v-katex="item.content"></div>
              <div
                style="font-size: 13px;display:flex;align-items:flex-end;"
                v-if="question.question_answers[0].question_answer_contents.length - 1 !== index"
              >、</div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel panel-reason" v-show="showTab('reason')">
        <div class="content">
          <span>请点击选择你的错误原因</span>
          <div class="checkboxs">
            <div
              v-for="(item, index) in tags"
              :key="index"
              :class="['tag', selected_tags.includes(item.id) ? 'selected' : '']"
              @click="clickTag(item.id)"
            >{{item.content}}</div>
          </div>
          <van-field
            v-if="tags.length > 0 && selected_tags.includes(tags[tags.length - 1].id)"
            style="font-size: 12px;"
            v-model="other"
            type="textarea"
            placeholder="请输入其他原因"
            rows="3"
            autosize
            @focus="toresize()"
          />
        </div>
      </div>
      <!-- 原因 -->
    </div>

    <van-button
      v-if="$route.query.type !== 'reason' && showTab('form')"
      class="submit"
      block
      round
      size="small"
      type="info"
      @click="submitAnswer"
      :disabled="submitDisabled"
    >提交答案</van-button>

    <van-button
      v-if="$route.query.type === 'reason' && showTab('reason')"
      class="submit"
      block
      round
      size="small"
      type="info"
      @click="submitReason"
      :disabled="reasonDisabled"
    >提交错误总结</van-button>
  </div>
</template>

<script>
import 'pepjs';
import katex from 'katex';
import 'myscript/dist/myscript.min.css';
import 'katex/dist/katex.min.css';
import * as MyScriptJS from 'myscript/dist/myscript.esm';
import { mapState, mapActions } from 'vuex';
import { ImagePreview } from 'vant';
import upload from '../../configs/upload';
import { VueMathjax } from 'vue-mathjax';
import axios from 'axios';

export default {
  // components: {
  //   'vue-mathjax': VueMathjax
  // },
  data() {
    return {
      show_close: false,
      active_tab: 'form',
      show_tabs: false,
      question: {},
      homework_answers: [],
      drawed: false,
      result: '',
      step: '',
      reason: [],
      other: '',
      tags: [],
      selected_tags: [],
      user_count: ''
    };
  },

  created() {
    this.onTypeInit();
    this.init(this.$route.params.question_id);
  },

  mounted() {
    // window.addEventListener('keyboardWillShow', function () {
    //   console.log('show1')
    // })

    // 监听键盘出现
    // window.addEventListener('native.keyboardshow', function() {
    //   const panel = document.getElementById('block-panel')
    //   panel.scrollTop = panel.scrollHeight
    // })

    // window.addEventListener('resize', function() {
    //   const panel = document.getElementById('block-panel')
    //   panel.scrollTop = panel.scrollHeight
    // })

    if (this.$route.query.type !== 'reason') {
      this.initMyscript();
    } else {
      this.initTags();
    }
  },

  beforeDestroy() {
    clearInterval(this.user_count);
  },

  computed: {
    ...mapState(['doing_questions']),
    /**
     * @description:
     * @param {type}
     * @return:
     */
    isNotFirstReason() {
      return this.homework_answers.length > 1;
    },
    /**
     * @description: 获取所有当前要操作的题目
     * @param {type}
     * @return:
     */
    currentQuestions() {
      let arr = this.doing_questions;
      if (this.$route.query.type === 'redo') {
        arr = this.doing_questions.filter(item => {
          // return (item.status === 'wrong' || item.status === 'redoing') && !item.is_redo;
          return item.status === 'wrong' || item.status === 'redoing';
        });
      } else if (this.$route.query.type === 'reason') {
        if (this.isNotFirstReason) {
          arr = this.doing_questions.filter(item => {
            // return (item.status === 'wrong' || item.status === 'redoing') && item.is_redo && item.homework_answers.length > 1;
            return item.status === 'wrong' && item.is_redo;
          });
        } else {
          arr = this.doing_questions.filter(item => {
            // return (item.status === 'wrong' || item.status === 'redoing') && !item.is_redo && item.homework_answers.length <= 1;
            return item.status === 'redoing' && !item.is_redo;
          });
        }
      }
      return arr;
    },
    /**
     * @description: 当前题目的序号
     * @param {type}
     * @return:
     */
    currentQuestionIndex() {
      const index = this.currentQuestions.findIndex(item => {
        return item.id === parseInt(this.$route.params.question_id);
      });
      return index + 1;
    },
    /**
     * @description: 当前进度
     * @param {type}
     * @return:
     */
    // todo: 需要处理百分比，分成三个部分（重做 、提交原因）
    percent() {
      return (this.currentQuestionIndex / this.currentQuestions.length) * 100;
    },
    /**
     * @description: 禁止提交
     * @param {type}
     * @return:
     */
    submitDisabled() {
      // return !((this.drawed || (!this.drawed && this.step)) && this.result)
      return !this.result;
    },
    /**
     * @description: 禁止提交原因
     * @param {type}
     * @return:
     */
    reasonDisabled() {
      if (this.selected_tags.length > 0) {
        if (this.selected_tags.includes(this.tags[this.tags.length - 1].id) && this.other === '') {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    /**
     * @description: 判断是否显示tabs
     * @param {type}
     * @return:
     */
    showTabs() {
      return Boolean(this.$route.query.type);
    },
    /**
     * @description: 判断是否是填写原因
     * @param {type}
     * @return:
     */
    onReason() {
      return this.$route.query.type === 'reason';
    },
    /**
     * @description: 首次答题的答案
     * @param {type}
     * @return:
     */
    answer_1() {
      if (this.homework_answers) {
        return this.homework_answers[0];
      } else {
        return null;
      }
    },
    /**
     * @description: 二次答题的答案
     * @param {type}
     * @return:
     */
    answer_2() {
      if (this.homework_answers) {
        return this.homework_answers[1];
      } else {
        return null;
      }
    },
    /**
     * @description: 显示第一次提交的原因
     * @param {type}
     * @return:
     */
    first_student_summaries() {
      if (this.homework_answers.length > 0 && this.homework_answers[0].student_summaries.length > 0) {
        return this.homework_answers[0].student_summaries;
      } else {
        return [];
      }
    },
    /**
     * @description: 第一次提交的content
     * @param {type}
     * @return:
     */
    first_student_summaries_content() {
      return this.first_student_summaries.reduce((content, item) => {
        if (item.content) {
          content = item.content;
        }
        return content;
      }, '');
    }
  },

  methods: {
    ...mapActions(['set_doing_question']),
    /**
     * @description: 页面高度
     * @param {type}
     * @return:
     */
    toresize() {
      const panel = document.getElementById('block-panel');
      panel.scrollTop = panel.scrollHeight;
      console.log(panel.scrollTop);
    },
    /**
     * @description: 初始化错误原因
     * @param {type}
     * @return:
     */
    initTags() {
      this.$api.question_tags().then(res => {
        this.tags = res.tags;
      });
    },
    /**
     * @description: 获取题目信息
     * @param {type}
     * @return:
     */
    init(id) {
      this.$api.get_question({ id: id, homework_id: this.$route.params.homework_id }).then(res => {
        this.question = res.homework_question.question;
        this.homework_answers = res.homework_question.homework_answers || [];
        this.result = '';
        this.step = '';
        this.other = '';
        this.selected_tags = [];
      });
    },
    /**
     * @description: 获取手写板的appkey跟mackey
     * @param {type}
     * @return:
     */
    initAppKeyAndMacKey() {
      return axios.get(process.env.VUE_APP_UPLOAD_URL + 'my_script_keys');
    },
    /**
     * @description: 手写板初始化，另外附加监听值
     * @param {type}
     * @return:
     */
    async initMyscript() {
      const keys = await this.initAppKeyAndMacKey().then(res => {
        return res.data.data;
      });
      const _this = this;
      const editorElement = this.$refs.editor;
      MyScriptJS.register(editorElement, {
        recognitionParams: {
          type: 'MATH',
          protocol: 'WEBSOCKET',
          apiVersion: 'V4',
          server: {
            scheme: 'https',
            host: 'cloud.myscript.com',
            applicationKey: keys.app_key,
            hmacKey: keys.mac_key
            // applicationKey: '2b08c438-64ef-4655-b0a6-a75986e23b5a',
            // hmacKey: '07a85927-f74c-4b78-a85f-0b0cd585ee7b'
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
      });
      window.addEventListener('resize', function() {
        editorElement.editor.resize();
      });
      editorElement.addEventListener('exported', function(editor) {
        const exports = editor.detail.exports;
        if (exports && exports['application/x-latex']) {
          _this.result = exports['application/x-latex'];
        } else {
          _this.result = '';
        }
      });
      this.user_count = setInterval(function() {
        axios.post(process.env.VUE_APP_UPLOAD_URL + 'my_script_keys', keys);
      }, 300000);
    },
    /**
     * @description: 根据tab处理数据初始化
     * @param {type}
     * @return:
     */
    onTypeInit() {
      switch (this.$route.query.type) {
        case 'redo':
          this.active_tab = 'form';
          this.show_tabs = true;
          break;
        case 'reason':
          this.active_tab = 'reason';
          this.show_tabs = true;
          break;
        default:
          this.active_tab = 'form';
          break;
      }
    },
    /**
     * @description: 通过tab_name判断是否显示内容
     * @param {type}
     * @return:
     */
    showTab(tab_name) {
      return this.active_tab === tab_name;
    },
    /**
     * @description: 点击切换tab
     * @param {type}
     * @return:
     */
    onClickTab(tab_name) {
      if (tab_name !== this.active_tab) {
        this.active_tab = tab_name;
      }
    },
    /**
     * @description: 清空答案
     * @param {type}
     * @return:
     */
    cleanResult() {
      this.$refs.editor.editor.clear();
    },
    /**
     * @description: 清空步骤
     * @param {type}
     * @return:
     */
    cleanStep() {
      if (this.step) {
        this.step = '';
      } else {
        this.$refs.draw.clean();
      }
    },
    /**
     * @description: 退出练习
     * @param {type}
     * @return:
     */
    close() {
      this.show_close = true;
      // this.$router.replace({ name: 'home' })
    },
    /**
     * @description: 下一个题目的id
     * @param {type}
     * @return:
     */
    nextQuestion() {
      // 找出当前id的index
      let currentIndex = this.doing_questions.findIndex(item => {
        return item.id === parseInt(this.$route.params.question_id);
      });

      let next = this.doing_questions.filter((item, index) => {
        return item.status === 'init' && index > currentIndex;
      });

      return next.length > 0 ? next[0] : null;
    },
    /**
     * @description: 下一个重做的题目的id
     * @param {type}
     * @return:
     */
    nextRedoQuestion() {
      let currentIndex = this.doing_questions.findIndex(item => {
        return item.id === parseInt(this.$route.params.question_id);
      });
      let next = this.doing_questions.filter((item, index) => {
        if (currentIndex === this.doing_questions.length - 1) {
          return (item.status === 'wrong' || item.status === 'redoing') && !item.is_redo && index < currentIndex;
        } else {
          return (item.status === 'wrong' || item.status === 'redoing') && !item.is_redo && index > currentIndex;
        }
      });

      return next.length > 0 ? next[0] : null;
    },
    /**
     * @description: 填写下一个题目的原因
     * @param {type}
     * @return:
     */
    nextReasonQuestion() {
      let currentIndex = this.doing_questions.findIndex(item => {
        return item.id === parseInt(this.$route.params.question_id);
      });

      let next = this.doing_questions.filter((item, index) => {
        if (this.isNotFirstReason) {
          if (currentIndex === this.doing_questions.length - 1) {
            return (
              (item.status === 'wrong' || item.status === 'redoing') &&
              item.is_redo &&
              item.homework_answers.length > 1 &&
              item.homework_answers[1].student_summaries.length < 1 &&
              index < currentIndex
            );
          } else {
            return (
              (item.status === 'wrong' || item.status === 'redoing') &&
              item.is_redo &&
              item.homework_answers.length > 1 &&
              item.homework_answers[1].student_summaries.length < 1 &&
              index > currentIndex
            );
          }
        } else {
          if (currentIndex === this.doing_questions.length - 1) {
            return (
              (item.status === 'wrong' || item.status === 'redoing') &&
              !item.is_redo &&
              item.homework_answers.length <= 1 &&
              item.homework_answers[0].student_summaries.length < 1 &&
              index < currentIndex
            );
          } else {
            return (
              (item.status === 'wrong' || item.status === 'redoing') &&
              !item.is_redo &&
              item.homework_answers.length <= 1 &&
              item.homework_answers[0].student_summaries.length < 1 &&
              index > currentIndex
            );
          }
        }
      });

      return next.length > 0 ? next[0] : null;
    },
    /**
     * @description: 提交内容
     * @param {type}
     * @return:
     */
    async submitAnswer() {
      let url = '';

      if (this.drawed) {
        const base64 = await this.$refs.draw.exportImg().then(res => {
          return res;
        });
        const timestrap = new Date().getTime();
        url = await upload({ name: timestrap + '.png', base64: base64 }).then(res => {
          return res;
        });
      } else if (this.step) {
        url = this.step;
      }

      let params = {
        id: this.$route.params.question_id,
        itype: this.$route.query.type ? this.$route.query.type : 'normal',
        answer_contents: [this.result],
        analysis: '',
        attachments: [
          {
            att_type: 'image',
            url: url,
            name: new Date().getTime() + '.png'
          }
        ]
      };

      const _this = this;
      this.$api
        .answer_question({
          id: _this.$route.params.question_id,
          params: params,
          homework_id: _this.$route.params.homework_id
        })
        .then(res => {
          const next = _this.$route.query.type
            ? _this.nextRedoQuestion(_this.$route.params.question_id)
            : _this.nextQuestion(_this.$route.params.question_id);
          // 更新题目信息
          this.$api.get_homework_info(this.$route.params.homework_id).then(res => {
            this.set_doing_question(res.homework_question_ids);
            const questions = res.homework_question_ids;
            if (!next) {
              const hadNeedRedoAndNotRedo = questions.some(item => {
                return (item.status === 'wrong' || item.status === 'redoing') && !item.is_redo;
              });
              if (hadNeedRedoAndNotRedo) {
                _this.$router.replace({
                  name: 'homework_judge',
                  params: { homework_id: _this.$route.params.homework_id }
                });
              } else {
                _this.$router.replace({
                  name: 'homework_result',
                  params: { homework_id: _this.$route.params.homework_id }
                });
              }
            } else {
              _this.cleanResult();
              _this.cleanStep();
              if (this.$route.query.type) {
                _this.$router.replace({
                  name: 'homework_question_do',
                  params: { homework_id: _this.$route.params.homework_id, question_id: next.id },
                  query: { type: 'redo' }
                });
              } else {
                _this.$router.replace({
                  name: 'homework_question_do',
                  params: { homework_id: _this.$route.params.homework_id, question_id: next.id }
                });
              }

              this.init(next.id);
            }
          });

          // if (!next) {
          //   // 更新题目信息
          //   this.$api.get_homework_info(this.$route.params.homework_id).then(res => {
          //     this.set_doing_question(res.homework_question_ids);
          //     const questions = res.homework_question_ids;
          //     const hadNeedRedoAndNotRedo = questions.some(item => {
          //       return (item.status === 'wrong' || item.status === 'redoing') && !item.is_redo;
          //     });
          //     if (hadNeedRedoAndNotRedo) {
          //       _this.$router.replace({
          //         name: 'homework_judge',
          //         params: { homework_id: _this.$route.params.homework_id }
          //       });
          //     } else {
          //       _this.$router.replace({
          //         name: 'homework_result',
          //         params: { homework_id: _this.$route.params.homework_id }
          //       });
          //     }
          //   });
          // } else {
          //   _this.cleanResult();
          //   _this.cleanStep();
          //   if (this.$route.query.type) {
          //     _this.$router.replace({
          //       name: 'homework_question_do',
          //       params: { homework_id: _this.$route.params.homework_id, question_id: next.id },
          //       query: { type: 'redo' }
          //     });
          //   } else {
          //     _this.$router.replace({
          //       name: 'homework_question_do',
          //       params: { homework_id: _this.$route.params.homework_id, question_id: next.id }
          //     });
          //   }

          //   this.init(next.id);
          // }
        });
    },
    /**
     * @description: 更新canvas是不是已经绘画过
     * @param {type}
     * @return:
     */
    updateDrawed(result) {
      this.drawed = result;
    },
    /**
     * @description: 预览图片
     * @param {type}
     * @return:
     */
    clickStepImg(url) {
      console.log([url ? url : this.step]);
      ImagePreview([url ? url : this.step]);
    },
    /**
     * @description: 点击选中
     * @param {type}
     * @return:
     */
    clickTag(result) {
      if (this.selected_tags.includes(result)) {
        const index = this.selected_tags.indexOf(result);
        this.selected_tags.splice(index, 1);
      } else {
        this.selected_tags.push(result);
      }
      if (!this.selected_tags.includes(this.tags[this.tags.length - 1].id)) {
        this.other = '';
      }
    },
    /**
     * @description: 提交原因
     * @param {type}
     * @return:
     */
    submitReason() {
      let tags = [];
      this.selected_tags.forEach((item, index) => {
        tags.push({ id: item, content: item === this.tags[this.tags.length - 1].id ? this.other : '' });
      });
      const homework_answer_id = this.homework_answers[this.isNotFirstReason ? 1 : 0].id;
      this.$api
        .summary_question({
          id: this.$route.params.question_id,
          params: { id: this.$route.params.question_id, tags: tags, homework_answer_id: homework_answer_id }
        })
        .then(() => {
          this.$api.get_homework_info(this.$route.params.homework_id).then(res => {
            this.set_doing_question(res.homework_question_ids);
            console.log(this.doing_questions);
            const next = this.nextReasonQuestion();
            if (!next) {
              if (this.isNotFirstReason) {
                this.$router.replace({
                  name: 'homework_result',
                  params: { homework_id: this.$route.params.homework_id }
                });
              } else {
                this.$router.replace({
                  name: 'homework_judge',
                  params: { homework_id: this.$route.params.homework_id }
                });
              }
            } else {
              this.$router.replace({
                name: 'homework_question_do',
                params: { homework_id: this.$route.params.homework_id, question_id: next.id },
                query: { type: 'reason' }
              });
              this.init(next.id);
            }
          });
        });
    },
    /**
     * @description: 图片拍照、上传
     * @param {type}
     * @return:
     */
    uploadImg() {
      const _this = this;
      navigator.camera.getPicture(
        url => {
          window.resolveLocalFileSystemURL(
            url,
            entry => {
              entry.file(
                function(file) {
                  let reader = new FileReader();
                  reader.onloadend = function() {
                    _this.$toast.loading({
                      mask: true,
                      message: '上传中...'
                    });
                    upload({
                      base64: this.result,
                      name: file.name
                    }).then(res => {
                      _this.cleanStep();
                      _this.step = res;
                      _this.$toast.clear();
                    });
                  };
                  reader.readAsArrayBuffer(file);
                },
                function(error) {
                  this.$toast.fail('图片读取失败，请重试！');
                  console.log('FileEntry.file error: ' + error.code);
                }
              );
            },
            err => {
              console.log(err);
              alert(err);
            }
          );
        },
        error => {
          console.log('摄像头打开失败，请重试！');
          // this.$toast.fail('摄像头打开失败，请重试！')
        },
        {
          quality: 50, // 质量
          sourceType: Camera.PictureSourceType.CAMERA, // 图片来源
          correctOrientation: true, // 如果是横向拍摄的照片，会自动旋转到正确的方向
          saveToPhotoAlbum: true, // 设备拍照后的图像是否保存的图片库中
          EncodingType: Camera.EncodingType.PNG
        }
      );
    },
    /**
     * @description: 锁住block区域
     * @param {type}
     * @return:
     */
    lockBlock() {
      const a = document.getElementById('block-panel');
      a.style.overflowY = 'hidden';
    },
    /**
     * @description: 解锁block区域
     * @param {type}
     * @return:
     */
    unlockBlock() {
      const a = document.getElementById('block-panel');
      a.style.overflowY = 'auto';
    }
  }
};
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
    }
  }

  .close-popup {
    padding: 15px;
    width: 50vw;
    min-height: 100px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    .title {
      font-size: 13px;
      color: #767789;
      margin-bottom: 20px;
    }

    .content {
      font-size: 11px;
      color: #767789;
      margin-bottom: 20px;
    }

    .btns {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }

  .question {
    background: #fff;
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 13px;
    .katex {
      font-size: 13px !important;
    }
  }

  .tabs {
    padding: 0 10px 10px;
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
    margin: 0 5px 10px;
    flex: 1;
    // padding: 5px;
    display: block;
    overflow: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
      background: #e8e8e8;
      position: relative;
    }
    &::-webkit-scrollbar-thumb {
      position: absolute;
      border-radius: 5px;
      width: 7px;
      height: 7px;
      background-color: #fff;
      // -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }
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
        width: 100%;
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
      // margin-bottom: 50px;
      // margin-bottom: 10px;
      .content {
        height: 120px;
        width: 100%;

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
      margin-bottom: 10px;
      .content {
        height: 160px;
        overflow-y: auto;
        display: flex;
        flex-flow: column nowrap;
        padding: 10px;
        width: calc(100% - 20px);

        span {
          font-size: 11px;
          color: #474e60;
        }

        .question-analyze {
          background: #fff;
          padding: 10px;
          font-size: 13px;
          color: #474e60;
          // float: left;
          // flex-flow: row wrap;
          // align-items: center;
          // p {
          //   margin: 0 !important;
          // }
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
      margin-bottom: 10px;
      margin-top: 10px;
      .content {
        min-height: 100px;
        padding: 10px;
        width: calc(100% - 20px);
        display: flex;
        flex-flow: column nowrap;

        span {
          font-size: 11px;
          color: #474e60;
        }

        .checkboxs {
          margin-top: 10px;
          display: flex;
          flex-flow: row nowrap;
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
              background: #3296fa;
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
    // margin: 10px;
    // position: absolute;
    // bottom: 10px;
    // left: 10px;
    // right: 10px;
  }

  #editor {
    height: 100%;
    width: calc(100% - 40px);
    margin: 0 20px;
    z-index: 10;
  }

  .draw-panel {
    height: 100%;
    width: calc(100% - 40px);
    padding: 0 20px;
    z-index: 10;
  }

  .result-element {
    color: #3296fa !important;
    font-size: 14px !important;
  }

  .answers {
    display: flex;
    align-items: center;
  }
  .katex-answer {
    font-size: 14px !important;
  }
  .question-answer {
    display: flex;
    // align-items: center;
    padding: 10px 10px 0;
    > div {
      display: flex;
    }
  }
}
</style>