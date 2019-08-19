<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-16 14:46:47
 * @LastEditTime: 2019-08-19 14:52:12
 * @LastEditors: 施永坚（yokins）
 -->
<template>
  <div class="login" id="login">
    <div class="form">
      <div class="title">
        登录
        <span>gin</span>
      </div>
      <span class="summary">欢迎来到世外数感，记录你的成长过程~</span>
      <van-cell-group>
        <label>账号</label>
        <van-field v-model="account" clearable placeholder="请输入用户名" />

        <label class="password-label">密码</label>
        <van-field
          v-model="password"
          clearable
          :type="fieldType"
          placeholder="请输入密码"
          @click-right-icon="onChangePasswordType"
        >
          <van-icon slot="right-icon" class-prefix="wm" :name="fieldTypeIcon" />
        </van-field>
      </van-cell-group>

      <van-cell-group>
        <van-button class="submit" round block type="info" size="small" :disabled="disabledSubmit" @click="submit" :loading="loading" loading-text="加载中...">登录</van-button>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      account: '',
      password: '',
      isText: false,
      loading: false
    }
  },

  computed: {
    /**
     * @description: 密码框的类型：文本、密码
     * @param {type}
     * @return:
     */
    fieldType() {
      return this.isText ? 'text' : 'password'
    },
    /**
     * @description: 密码框的眼睛：文本类型icon
     * @param {type}
     * @return:
     */
    fieldTypeIcon() {
      return this.isText ? 'eye-open' : 'eye-close'
    },
    /**
     * @description: 没填写完成就不允许提交
     * @param {type}
     * @return:
     */
    disabledSubmit() {
      return !this.account || !this.password
    }
  },

  methods: {
    ...mapActions(['set_current_user']),
    /**
     * @description: 修改密码框的类型
     * @param {type}
     * @return:
     */
    onChangePasswordType() {
      this.isText = !this.isText
    },
    /**
     * @description: 登录
     * @param {type}
     * @return:
     */
    submit() {
      this.loading = true
      this.$api.login({ login: this.account, password: this.password }).then(res => {
        this.loading = false
        this.set_current_user(res.user)
        this.$router.push({ name: 'home' })
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;

  .wm-eye-open {
    font-size: 17px;
  }

  .form {
    padding: 30px 15px;
    display: flex;
    flex-flow: column nowrap;

    .title {
      color: #474e60;
      font-size: 24px;
      padding: 0 15px 20px;
      display: flex;
      flex-flow: row nowrap;
      span {
        color: #d7dce9;
        display: flex;
        margin-left: 10px;
      }
    }

    .summary {
      font-size: 11px;
      color: #474e60;
      padding: 0 15px;
      display: flex;
      margin-bottom: 25px;
    }

    div::after {
      border: 0;
    }

    label {
      font-size: 13px;
      color: #474e60;
      display: flex;
      padding: 0 15px;
    }

    .password-label {
      margin-top: 15px;
    }

    .submit {
      margin-top: 15px;
    }
  }
}
</style>