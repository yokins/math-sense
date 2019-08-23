<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-07-31 13:12:48
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-23 09:34:36
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page tree">
    <van-nav-bar :z-index="1000" title="成长树" left-arrow @click-left="onClickLeft" />

    <van-list class="tree-list" v-model="load_loading" :finished="load_finished" finished-text="没有更多了" @load="onLoad">
      <div class="tree-item" v-for="(item, index) in list" :key="index" @click="to_tree_show(item)">
        <div class="date">{{ item.idate }}</div>
        <div class="content">
          <div class="info">
            <div class="title">{{ item.title }}</div>
            <div class="result">答对{{ item.question_right_count }}题(共{{ item.question_count }}题)</div>
          </div>
          <span class="iconfont icon-arrow"></span>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { List } from 'vant'
export default {
  components: {
    [List.name]: List
  },
  data() {
    return {
      list: [],

      load_loading: false,
      load_finished: false,
      page: 1
    }
  },
  mounted() {
    this.onLoad(true)
  },
  methods: {
    onLoad(way) {
      const _this = this
      setTimeout(() => {
        let payload = { page: _this.page }
        _this.$api.tree(payload).then(res => {
          if (way || _this.page === 1) {
            _this.list = res.homeworks
          } else {
            _this.list = _this.list.concat(res.homeworks)
          }
          _this.load_loading = false
          if (res.homeworks.length < 25) {
            this.load_finished = true
          } else {
            _this.page += 1
          }
        })
      }, 500)
    },
    /**
     * @description: 跳转到显示页面
     * @param {type}
     * @return:
     */
    to_tree_show(item) {
      this.$router.push({ name: 'homework_result', params: { homework_id: item.id }, query: { type: 'show' } })
    },
    /**
     * @description: 返回
     * @param {type}
     * @return:
     */
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree {
  .tree-list {
    margin-top: 20px;
  }

  .tree-item {
    display: flex;
    flex-flow: column nowrap;
    padding-right: 20px;
    padding-left: 20px;
    padding-bottom: 30px;
    margin-left: 20px;
    position: relative;

    .date {
      font-size: 16px;
      color: #3296fa;
      margin-bottom: 10px;
    }

    .content {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      background: #fff;
      border-radius: 15px;
      padding: 15px;

      .info {
        flex: 1;

        .title {
          color: #474e60;
          font-size: 16px;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .result {
          font-size: 11px;
          color: #474e60;
        }
      }
    }

    &:not(:last-child) {
      border-left: 3px solid #80bfff;
    }

    &:before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 8px;
      background: #3296fa;
      top: 5px;
      left: -6px;
      box-shadow: 0 0 0 5px #bddeff;
    }
  }
}
</style>
