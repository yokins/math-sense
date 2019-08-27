<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:47:33
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-27 16:30:36
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
      <div class="title last">请重新审题并且作答</div>

      <div class="tip">点击订正按钮完成重新作答</div>
      <div class="tip">重新作答时可查看上一次作答的草稿和答案</div>
    </div>

    <div class="list">
      <div v-for="(item, index) in homework_question_ids" :key="index" :class="['item', item.status]">{{ index + 1 }}</div>
    </div>

    <van-button class="submit" block round type="warning" @click="goRedo">订正题目</van-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      homework_question_ids: []
    }
  },
  computed: {
    /**
     * @description: 错误题目数量
     * @param {type}
     * @return:
     */
    wrong_and_not_redo_count() {
      return this.homework_question_ids.filter(item => {
        return item.status === 'wrong' && !item.is_redo
      }).length
    }
  },
  created() {
    this.init()
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
        this.set_doing_question(res.homework_question_ids)
        this.homework_question_ids = res.homework_question_ids
      })
    },
    /**
     * @description: 关闭页面，返回主页
     * @param {type}
     * @return:
     */
    onClickLeft() {
      this.$router.replace({ name: 'home' })
    },
    /**
     * @description: 跳转重做
     * @param {type}
     * @return:
     */
    goRedo() {
      const redoQuestion = this.homework_question_ids.filter(item => {
        return item.status === 'wrong' && !item.is_redo
      })[0]
      console.log('TCL: goRedo -> redoQuestion', redoQuestion)
      this.$router.replace({
        name: 'homework_question_do',
        params: { homework_id: this.$route.params.homework_id, question_id: redoQuestion.id },
        query: { type: 'redo' }
      })
    },
    /**
     * @description: 关闭页面
     * @param {type} 
     * @return: 
     */
    close() {
      this.$router.replace({ name: 'home' })
    }
  }
}
</script>

<style lang="scss" scoped>
.homework-judge {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
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

  .submit {
    margin: 0 25px 20px;
    width: calc(100vw - 50px);
  }
}
</style>