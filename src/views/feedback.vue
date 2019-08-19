<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:46:59
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-19 15:30:54
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page feedback" id="feedback">
    <van-nav-bar
      fixed
      :z-index="1000"
      title="意见反馈"
      left-text="返回"
      right-text="提交"
      left-arrow
      @click-left="onClickLeft"
      @click-right="submit"
    />

    <div class="form">
      <label>输入您想要反馈的问题</label>
      <van-field class="content" v-model="content" type="textarea" placeholder="请输入意见" rows="5" autosize />
      <label>留下您的联系方式</label>
      <van-field class="contact" v-model="contact" clearable placeholder="请输入练习方式" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      contact: ''
    }
  },
  methods: {
    /**
     * @description: 返回
     * @param {type}
     * @return:
     */
    onClickLeft() {
      this.$router.go(-1)
    },
    /**
     * @description: 提交
     * @param {type}
     * @return:
     */
    submit() {
      if (!this.content || !this.contact) {
        this.$toast({
          duration: 2000,
          message: '请完整填写内容！'
        })
      } else {
        this.$api.feedbacks({ content: this.content, contact: this.contact }).then(() => {
          this.$toast({
            duration: 2000,
            message: '提交成功！'
          })
          this.content = ''
          this.contact = ''
          this.$router.go(-1)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.feedback {
  .form {
    margin-top: 15px;
    background: #fff;
    padding: 15px;

    label {
      font-size: 13px;
      color: #474e60;
      margin-bottom: 15px;
      display: block;
    }

    .content {
      background: #f4f5f7;
      margin-bottom: 15px;
    }

    .contact {
      background: #f4f5f7;
      margin-bottom: 15px;
    }
  }
}
</style>