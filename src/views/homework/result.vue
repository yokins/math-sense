<template>
  <div class="result">
    <van-nav-bar v-if="$route.query.type" :border="false" :z-index="1000">
      <van-icon slot="left" class-prefix="wm" name="close" @click="onClickLeft"></van-icon>
    </van-nav-bar>

    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>
    <div class="bokeh"></div>

    <div class="pyro">
      <div class="before"></div>
      <div class="after"></div>
    </div>

    <div class="img">
      <span>完成 {{ homework_question_count }} 题练习</span>
    </div>

    <div class="tip">
      <span>错误 {{ wrongQuestions.length }} 题</span>
    </div>

    <div class="wrong-item" v-for="(item, index) in wrongQuestions" :key="index" @click="toReason(item)">
      <div class="index">{{ questionIndex(item.id) + 1 }}</div>
      <div class="text" v-if="isShow">
        <span class="reason-span">{{ showReason(item.student_summaries) }}</span>
        <van-icon style="margin-right: 10px;" name="arrow"></van-icon>
      </div>
      <div class="text" v-else>
        {{ item.student_summaries.length > 0 ? '已选择原因' : '请总结错误原因' }}
        <van-icon style="margin-right: 10px;" name="arrow"></van-icon>
      </div>
    </div>

    <div class="tip">
      <span>正确 {{ rightQuestions.length }} 题</span>
    </div>

    <div class="tasks">
      <div
        v-for="(item, index) in rightQuestions"
        :key="index"
        :class="['task-item', 'correct']"
        @click="toReason(item)"
      >{{ questionIndex(item.id) + 1 }}</div>
    </div>

    <button class="submit" v-if="!isShow" :disabled="can_not_submit" @click="submit">完成练习</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      homework_question_count: 0,
      homework_question_ids: []
    }
  },

  computed: {
    /**
     * @description: 最终正确的题目
     * @param {type}
     * @return:
     */
    rightQuestions() {
      return this.homework_question_ids.filter(item => {
        return item.status === 'right'
      })
    },
    /**
     * @description: 最终错的题目
     * @param {type}
     * @return:
     */
    wrongQuestions() {
      return this.homework_question_ids.filter(item => {
        return item.status === 'wrong' && item.is_redo
      })
    },
    /**
     * @description: 是否能完结
     * @param {type}
     * @return:
     */
    can_not_submit() {
      return this.wrongQuestions.some(item => {
        return item.student_summaries.length < 1 && item.status
      })
    },
    /**
     * @description: 是否是显示情况
     * @param {type}
     * @return:
     */
    isShow() {
      return this.$route.query.type === 'show'
    }
  },

  created() {
    this.init()
  },

  methods: {
    ...mapActions(['set_doing_question']),
    /**
     * @description: 点击返回
     * @param {type}
     * @return:
     */
    onClickLeft() {
      this.$router.go(-1)
    },
    /**
     * @description: 拉取练习信息
     * @param {type}
     * @return:
     */
    init() {
      this.$api.get_homework_info(this.$route.params.homework_id).then(res => {
        this.set_doing_question(res.homework_question_ids)
        this.homework_question_ids = res.homework_question_ids
        this.homework_question_count = res.homework_question_count
      })
    },
    /**
     * @description: 查询各自里边的序号
     * @param {type}
     * @return:
     */
    questionIndex(id) {
      return this.homework_question_ids.findIndex(item => {
        return item.id === id
      })
    },
    /**
     * @description: 提交
     * @param {type}
     * @return:
     */
    submit() {
      this.$api.complete(this.$route.params.homework_id).then(() => {
        this.$router.replace({ name: 'home' })
      })
    },
    /**
     * @description: 去填写原因
     * @param {type}
     * @return:
     */
    toReason(item) {
      if (this.isShow || item.status !== 'wrong' || (item.student_summaries.length > 0 && item.status === 'wrong')) {
        this.$router.push({
          name: 'homework_question_show',
          params: { homework_id: this.$route.params.homework_id, question_id: item.id },
          query: { type: 'back' }
        })
      } else {
        if (item.student_summaries.length <= 0 && item.status === 'wrong') {
          this.$router.replace({
            name: 'homework_question_do',
            params: { homework_id: this.$route.params.homework_id, question_id: item.id },
            query: { type: 'reason' }
          })
        }
      }
    },
    /**
     * @description: 显示原因
     * @param {type}
     * @return:
     */
    showReason(reasons) {
      let desc = ''
      reasons.forEach((item, index) => {
        const symbol = reasons.length - 1 === index ? '' : '、'
        if (item.content) {
          desc = desc + item.content + symbol
        } else {
          desc = desc + item.tag.content + symbol
        }
      })
      return desc
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/biu.scss';

.result {
  padding-bottom: 70px;
  min-height: calc(100vh - 70px);
  width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;

  .img {
    background-image: url('../../assets/images/result.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 100vw;
    height: 150px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: flex-end;

    span {
      font-size: 13px;
      display: flex;
      margin-bottom: 10px;
      color: #fff;
    }
  }

  .wrong-item {
    width: calc(100% - 130px);
    margin: 0 auto;
    background: #f4f5f7;
    height: 30px;
    border-radius: 30px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 10px;
    }

    .index {
      width: 30px;
      height: 30px;
      border-radius: 30px;
      background: #ff7b4d;
      color: #fff;
      font-size: 14px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
    }

    .text {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      font-size: 10px;
      color: #767789;
    }
  }

  .tip {
    text-align: center;
    margin-bottom: 10px;
    margin-top: 10px;

    span {
      color: #767789;
      font-size: 13px;
      position: relative;

      &:before {
        content: '';
        width: 20px;
        height: 2px;
        background: #d8d9ec;
        position: absolute;
        top: 8px;
        right: 120%;
      }

      &:after {
        content: '';
        width: 20px;
        height: 2px;
        background: #d8d9ec;
        position: absolute;
        top: 8px;
        left: 120%;
      }
    }
  }

  .tasks {
    width: calc(100% - 60px);
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    margin: 0 auto;

    .task-item {
      width: 45px;
      height: 45px;
      border-radius: 45px;
      color: #fff;
      font-size: 18px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      margin-bottom: 18px;
      margin-right: 9px;
      margin-left: 9px;

      &.correct {
        background: #3296fa;
      }

      &.error {
        background: #ff7b4d;
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 15px;
    margin: 0 15px;
    width: calc(100% - 30px);
    background: #3296fa;
    border-radius: 45px;
    padding: 10px;
    font-size: 11px;
    color: #fff;
    border: 0;

    &:disabled {
      background: rgba(179, 179, 179, 1);
    }
  }

  .reason-span {
    display: inline-block;
    width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: right;
  }
}
</style>
