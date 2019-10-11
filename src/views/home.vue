<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:46:35
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-10-11 16:40:09
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page home" id="home">
    <div class="banner">
      <div class="banner-img"></div>
      <div class="banner-tab">
        <div class="tab-item" @click="$router.push({ name: 'tree' })">
          <div class="icon tree">
            <img src="../assets/images/tree.png" alt />
          </div>成长树
        </div>
        <div class="tab-item" @click="$router.push({ name: 'mistake' })">
          <div class="icon note">
            <img src="../assets/images/note.png" alt />
          </div>错题本
        </div>
      </div>
    </div>

    <div class="list" style="flex: 1;flex-flow: column;display: flex;">
      <div class="title">
        练习记录
        <span>本月已累计答错 {{total_wrong_count}} 题</span>
      </div>

      <van-pull-refresh style="flex: 1;" v-model="isLoading" @refresh="initData">
        <div v-if="list.length <= 0 && !isLoading"  class="placeholder">
          没有练习哦~
        </div>
        <homework-item v-for="(item, index) in list" :key="index" :homework="item"></homework-item>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      list: [],
      total_wrong_count: 0,
      isLoading: false
    }
  },

  created() {
    this.initData()
  },

  methods: {
    ...mapActions(['clean_doing_question']),
    /**
     * @description: 拉取首页数据
     * @param {type}
     * @return:
     */
    initData() {
      setTimeout(() => {
        this.$api.home().then(res => {
          this.list = res.homeworks
          this.total_wrong_count = res.total_wrong_count
          this.isLoading = false
        })
      }, 500)
    },
    /**
     * @description: 清除doing_questions
     * @param {type}
     * @return:
     */
    cleanData() {
      this.clean_doing_question()
    }
  }
}
</script>

<style lang="scss">
.home {
  min-height: calc(100vh - 50px);
  padding-bottom: 50px;
  display: flex;
  flex-flow: column nowrap;
  .banner {
    padding: 10px 30px 0 15px;
    background: #3f8166;
    position: relative;
    .banner-img {
      height: 170px;
      background-image: url('../assets/images/home-bg.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .banner-tab {
      background: #fff;
      border-radius: 10px;
      position: absolute;
      display: flex;
      flex-flow: row nowrap;
      width: calc(100% - 30px);
      height: 70px;
      bottom: -35px;
      left: 15px;
      .tab-item {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #474e60;
        position: relative;

        .icon {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          margin-right: 15px;

          img {
            width: 35px;
            height: 35px;
          }
          &.tree {
            background: #d3f3b6;
          }

          &.note {
            background: #b6d9f3;
          }
        }

        &:last-child:before {
          content: '';
          position: absolute;
          left: 0;
          height: 30px;
          top: 20px;
          width: 2px;
          background: #e1e1e1;
        }
      }
    }
  }

  .placeholder {
    min-height: 200px;
    font-size: 12px;
    color: #e1e1e1;
    text-align: center;
    padding-top: 15px;
  }

  .list {
    margin-top: 50px;
    padding: 0 15px;
    .title {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #474e60;
      span {
        font-size: 11px;
        color: #767789;
      }
    }
  }
}
</style>