<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:47:43
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-10-14 16:18:26
 * @Incantation: Buddha Bless Do Not Bugs
 -->

<template>
  <div class="page homework-start">
    <van-nav-bar :border="false">
      <van-icon slot="left" class-prefix="wm" name="close" @click="close"></van-icon>
    </van-nav-bar>
    <!-- <div class="close-line">
      <van-icon class-prefix="wm" name="close" style="font-size: 20px;" @click="close"></van-icon>
    </div>-->

    <div class="introduce">
      <div class="title">练习马上开始</div>
      <div class="title last">深呼吸调整好自己的最佳状态</div>

      <div class="tip">如需打印题目，可点击下方分享按钮发送至微信</div>
      <div class="tip">注意查看答案识别是否正确</div>
      <div class="tip">有些题目需要填写多个答案，不要忘了哦~</div>
    </div>

    <div class="img-with-summary">
      <div class="summary">
        练习共
        <span>{{homework_question_count}}</span> 题，涉及
        <span>{{knowledge_count}}</span> 个知识点
      </div>
      <div class="vector"></div>
    </div>

    <van-row class="btn-line" gutter="15">
      <van-col span="8">
        <!-- <van-button round block size="small" type="warning" @click="onCopy">复制网址</van-button> -->

        <!-- <a href="weixin://" class="action-callweixin">
          <van-button round block size="small" type="warning">打开微信</van-button>
        </a>-->

        <van-button round block size="small" type="warning" @click="shareOption">分享</van-button>
      </van-col>
      <van-col span="16">
        <van-button round block size="small" type="info" @click="next">开始练习</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  data() {
    return {
      batch_id: 0,
      homework_id: this.$route.params.homework_id,
      homework_question_count: 0,
      knowledge_count: 0
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState(['doing_questions'])
  },
  methods: {
    ...mapActions(['set_doing_question']),
    /**
     * @description: 拉取练习信息
     * @param {type}
     * @return:
     */
    async init() {
      await this.$api.get_homework_info(this.homework_id).then(res => {
        this.homework_question_count = res.homework_question_count;
        this.knowledge_count = res.knowledge_count;
        this.set_doing_question(res.homework_question_ids);
        this.batch_id = res.batch_id;
        this.checkToResultOrJudge();
      });
    },
    /**
     * @description: 检查是否需要直接跳转到结果页，或者结算页
     * @param {type}
     * @return:
     */
    checkToResultOrJudge() {
      // 未做题目
      const hadInitQuestion = this.doing_questions.some(item => {
        return item.status === 'init';
      });
      // 第一次需要总结原因
      const hadFirstReason = this.doing_questions.some(item => {
        return item.status === 'redoing' && item.is_redo;
      });
      // 需要重做但是没做
      const hadRedoAndNotDoQuestion = this.doing_questions.some(item => {
        return item.status === 'redoing' && !item.is_redo;
      });

      if (hadInitQuestion) {
        return false;
      } else if (hadFirstReason) {
        const toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: '正在加载...'
        });
        let second = 3;
        const timer = setInterval(() => {
          second--;
          if (second) {
            this.$router.replace({ name: 'homework_judge', params: { homework_id: this.homework_id } });
          } else {
            clearInterval(timer);
            this.$toast.clear();
          }
        }, 1000);
      } else if (hadRedoAndNotDoQuestion) {
        const toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: '正在加载...'
        });
        let second = 3;
        const timer = setInterval(() => {
          second--;
          if (second) {
            this.$router.replace({ name: 'homework_judge', params: { homework_id: this.homework_id } });
          } else {
            clearInterval(timer);
            this.$toast.clear();
          }
        }, 1000);
      } else {
        const toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: '正在加载...'
        });
        let second = 3;
        const timer = setInterval(() => {
          second--;
          if (second) {
            this.$router.replace({ name: 'homework_result', params: { homework_id: this.homework_id } });
          } else {
            clearInterval(timer);
            this.$toast.clear();
          }
        }, 1000);
      }
    },
    /**
     * @description: 点击复制
     * @param {type}
     * @return:
     */
    onCopy() {
      cordova.plugins.clipboard.copy('你好');
      this.$toast('文件地址已复制，请至浏览器下载！');
    },
    /**
     * @description: 开始练习
     * @param {type}
     * @return:
     */
    next() {
      // 未做题目
      const hadInitQuestion = this.doing_questions.some(item => {
        return item.status === 'init';
      });
      // 需要重做但是没做
      const hadRedoAndNotDoQuestion = this.doing_questions.some(item => {
        return (item.status === 'wrong' || item.status === 'redoing') && !item.is_redo;
      });
      if (hadInitQuestion || hadRedoAndNotDoQuestion) {
        this.$router.replace({ name: 'homework_loading', params: { homework_id: this.homework_id } });
      } else {
        this.$router.replace({ name: 'homework_result', params: { homework_id: this.homework_id } });
      }
    },
    /**
     * @description: 返回列表
     * @param {type}
     * @return:
     */
    close() {
      this.$router.replace({ name: 'home' });
    },
    /**
     * @description: 分享
     * @param {type}
     * @return:
     */
    shareOption() {
      var options = {
        message: '练习下载链接', // 分享的内容
        url: process.env.VUE_APP_FILE + this.batch_id
        //         url: `http://sg-test.wfl-ischool.cn/#/training/index?id=${this.batch_id}`,//外链
      };

      var onSuccess = function(result) {
        // alert(JSON.stringify(result))
      };

      var onError = function(error) {
        // alert(JSON.stringify(error))
      };

      window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    }
  }
};
</script>

<style lang="scss" scoped>
.homework-start {
  background: #fff;
  // padding: 0 15px 15px;
  min-height: calc(100vh - 15px);
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;

  .close-line {
    display: flex;
    flex-flow: row nowrap;
    margin-bottom: 20px;
  }

  .introduce {
    padding: 0 15px;
    display: flex;
    flex-flow: column nowrap;
    margin-bottom: 20px;

    .title {
      font-size: 18px;
      color: #474e60;
      font-weight: bolder;
      margin-bottom: 7px;

      &.last {
        margin-bottom: 10px;
      }
    }

    .tip {
      color: #767789;
      position: relative;
      font-size: 12px;
      margin-bottom: 10px;
      padding-left: 10px;

      &::before {
        content: '';
        position: absolute;
        width: 4px;
        left: 0;
        height: 100%;
        background: #3296fa;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .img-with-summary {
    padding: 0 15px;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    .summary {
      color: #474e60;
      font-weight: bolder;
      font-size: 16px;
      text-align: center;
      margin-bottom: 15px;
      span {
        color: #3296fa;
      }
    }

    .vector {
      width: 100%;
      height: 180px;
      background-image: url('../../assets/images/vector.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  .btn-line {
    padding: 0 15px;
    margin-bottom: 15px;
  }
}
</style>