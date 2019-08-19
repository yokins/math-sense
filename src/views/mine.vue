<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:46:35
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-19 14:49:06
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page mine" id="mine">
    <div class="banner">
      <div class="user-info">
        <img src="../assets/images/avatar.png" alt />
        {{ current_user.name }}
      </div>
    </div>
    <van-cell title="意见反馈" is-link to="/feedback">
      <van-icon slot="icon" class-prefix="wm" name="msg" style="line-height: inherit;margin-right: 10px;" />
    </van-cell>
    <van-button block type="default" @click="logout">注销登录</van-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },

  created() {},

  computed: {
    ...mapState(['current_user'])
  },

  methods: {
    ...mapActions(['clean_current_user']),
    /**
     * @description: 注销
     * @param {type} 
     * @return: 
     */
    logout() {
      this.clean_current_user()
      this.$router.replace({ name: 'login' })
    }
  }
}
</script>

<style lang="scss">
.mine {
  .banner {
    background: #3f8166;
    height: 180px;
    background-image: url('../assets/images/mine-bg.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    position: relative;

    .user-info {
      position: absolute;
      bottom: 0;
      padding: 40px 35px;
      font-size: 16px;
      color: #fff;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      img {
        margin-right: 10px;
        width: 60px;
        height: 60px;
        border-radius: 30px;
      }
    }
  }
}
</style>