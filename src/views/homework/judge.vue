<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:47:33
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-10-16 15:40:21
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="homework-judge" id="homework-judge">
    <van-nav-bar :border="false">
      <van-icon slot="left" class-prefix="wm" name="close" @click="close"></van-icon>
    </van-nav-bar>

    <div class="wrapper">
      <div class="title">
        你有
        <span>{{ wrong_and_not_redo_count }}</span> 道练习题需要订正
      </div>
      <div class="title last">请总结错误原因然后进行订正</div>
      <div class="tip">点击订正按钮完成订正题目</div>
      <div class="tip">订正题目时可查看上一次作答的步骤和答案</div>
    </div>

    <div class="wrong-questions">
      <div class="title">
        错误
        <span>{{wrong_question.length}}</span> 题
      </div>
      <div class="question" v-for="(item, index) in wrong_question" :key="index" @click="toSummary(item.question)">
        <div class="index">{{item.index}}</div>
        <div class="desc">
          <div class="reason">{{ showSummary(item.question) }}</div>
          <van-icon style="margin-right: 10px;" name="arrow"></van-icon>
        </div>
      </div>
    </div>

    <div class="right-questions">
      <div class="title">
        正确
        <span>{{right_question.length}}</span> 题
      </div>
      <div class="questions">
        <div class="index question" v-for="(item, index) in right_question" :key="index" @click="toShow(item)">{{ item.index }}</div>
      </div>
    </div>

    <!-- <div class="list">
      <div v-for="(item, index) in homework_question_ids" :key="index" :class="['item', item.status]">{{ index + 1 }}</div>
    </div>-->
    <div class="bottom-panel">
      <van-button class="submit" size="small" block round type="warning" :disabled="cantRedo" @click="goRedo">订正题目</van-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      homework_question_ids: []
    };
  },
  computed: {
    /**
     * @description: 错误题目数量
     * @param {type}
     * @return:
     */
    wrong_and_not_redo_count() {
      return this.homework_question_ids.filter(item => {
        return (item.status === 'wrong' || item.status === 'redoing')  && !item.is_redo;
      }).length;
    },
    /**
     * @description: 错误题目
     * @param {type}
     * @return:
     */
    wrong_question() {
      return this.homework_question_ids.reduce((arr, item, index) => {
        if ((item.status === 'wrong' || item.status === 'redoing') && !item.is_redo) {
          arr.push({ index: index + 1, question: item });
        }
        return arr;
      }, []);
    },
    /**
     * @description: 正确的题目
     * @param {type}
     * @return:
     */
    right_question() {
      return this.homework_question_ids.reduce((arr, item, index) => {
        if (item.status === 'right') {
          arr.push({ index: index + 1, question: item });
        }
        return arr;
      }, []);
    },
    /**
     * @description: 判断是否能进行订正
     * @param {type} 
     * @return: 
     */
    cantRedo() {
      return this.homework_question_ids.some((item, index) => {
        return (item.status === 'wrong' || item.status === 'redoing') && !item.is_redo && item.homework_answers[0].student_summaries.length <= 0
      })
    }
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions(['set_doing_question']),
    /**
     * @description: 拉取练习信息
     * @param {type}
     * @return:
     */
    init() {
      this.$api.get_homework_info(this.$route.params.homework_id).then(res => {
        this.set_doing_question(res.homework_question_ids);
        this.homework_question_ids = res.homework_question_ids;
      });
    },
    /**
     * @description: 关闭页面，返回主页
     * @param {type}
     * @return:
     */
    onClickLeft() {
      this.$router.replace({ name: 'home' });
    },
    /**
     * @description: 跳转重做
     * @param {type}
     * @return:
     */
    goRedo() {
      const redoQuestion = this.homework_question_ids.filter(item => {
        return (item.status === 'wrong' || item.status === 'redoing') && !item.is_redo;
      })[0];
      console.log('TCL: goRedo -> redoQuestion', redoQuestion);
      this.$router.replace({
        name: 'homework_question_do',
        params: { homework_id: this.$route.params.homework_id, question_id: redoQuestion.id },
        query: { type: 'redo' }
      });
    },
    /**
     * @description: 关闭页面
     * @param {type}
     * @return:
     */
    close() {
      this.$router.replace({ name: 'home' });
    },
    /**
     * @description: 显示是否已经总结过错误原因
     * @param {type}
     * @return:
     */
    showSummary(question) {
      const arr = question.homework_answers[0].student_summaries;
      if (arr.length > 0) {
        return arr.reduce((str, item, index) => {
          const symbol = arr.length - 1 === index ? '' : '、';
          if (item.content) {
            str = str + item.content + symbol;
          } else {
            str = str + item.tag.content + symbol;
          }
          return str;
        }, '');
      } else {
        return '请总结错误原因';
      }
    },
    /**
     * @description: 进入总结
     * @param {type} 
     * @return: 
     */
    toSummary(question) {
      if (question.homework_answers[0].student_summaries.length > 0) {
        this.$router.push({
          name: 'homework_question_show',
          params: { homework_id: this.$route.params.homework_id, question_id: question.id },
          query: { type: 'back' }
        })
      } else {
        this.$router.replace({
          name: 'homework_question_do',
          params: { homework_id: this.$route.params.homework_id, question_id: question.id },
          query: { type: 'reason' }
        })
      }
    },
    /**
     * @description: 跳转到显示
     * @param {type} 
     * @return: 
     */
    toShow(item) {
      this.$router.push({
        name: 'homework_question_show',
        params: { homework_id: this.$route.params.homework_id, question_id: item.question.id },
        query: { type: 'back' }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.homework-judge {
  min-height: calc(100vh - 60px);
  padding-bottom: 60px;
  width: 100vw;
  overflow-x: hidden;
  // overflow-y: auto;
  background: #fff;
  display: flex;
  flex-flow: column nowrap;

  .wrapper {
    padding: 0 15px;
    .title {
      font-size: 18px;
      color: #474e60;
      font-weight: bolder;
      margin-bottom: 15px;

      &.last {
        margin-bottom: 10px;
      }

      span {
        color: #ff7b4d;
      }
    }

    .tip {
      color: #767789;
      position: relative;
      font-size: 11px;
      margin-bottom: 10px;
      padding-left: 10px;

      &::before {
        content: '';
        position: absolute;
        width: 2px;
        left: 0;
        height: 100%;
        background: #3296fa;
      }
    }
  }

  .list {
    flex: 1;
    overflow-y: auto;
    margin-top: 30px;
    padding: 0 15px;
    // display: flex;
    // flex-flow: row wrap;
    // justify-content: flex-start;
    // align-items: flex-start;

    .item {
      float: left;
      margin-bottom: 10px;
      margin-right: 10px;
      width: 45px;
      height: 45px;
      border-radius: 30px;
      font-size: 18px;
      color: #fff;
      background: #3296fa;
      display: flex;
      justify-content: center;
      align-items: center;

      &.wrong {
        background: #ff7b4d;
      }
    }
  }

  .bottom-panel {
    position: fixed;
    bottom: 0;
    height: 50px;
    margin: 0 15px;
    width: calc(100% - 30px);
    background: #fff;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;

    .submit {
      width: 100%;
    }
  }

  .index {
    width: 45px;
    height: 45px;
    border-radius: 45px;
    color: #fff;
    font-size: 14px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  }

  .wrong-questions {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin-top: 15px;
    .title {
      font-size: 14px;
      color: #767789;
      span {
        color: #ff7b4d;
      }
    }

    .question {
      width: 80%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      background: #f4f5f7;
      justify-content: space-between;
      border-radius: 45px;
      margin-top: 15px;

      .index {
        background: #ff7b4d;
      }

      .desc {
        width: 80%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: flex-end;
        color: #767789;
        .reason {
          width: 80%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          text-align: right;
          font-size: 14px;
        }

        .van-icon {
          font-size: 14px;
        }
      }
    }
  }

  .right-questions {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin-top: 15px;
    .title {
      font-size: 14px;
      color: #767789;
      span {
        color: #3296fa;
      }
    }

    .index {
      background: #3296fa;
    }

    .questions {
      margin-top: 15px;
      width: 80%;
      display: flex;
      flex-flow: row wrap;

      .index {
        margin-bottom: 10px;
        margin-right: 15px;
      }
    }
  }
}
</style>