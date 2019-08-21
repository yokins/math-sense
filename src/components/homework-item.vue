<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-19 11:17:45
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-21 15:48:34
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="homework-item" @click="to_homework">
    <div class="line">
      <div class="title">{{homework.title}}</div>
      <span :class="['status', homework.status]">{{ homework.status | homeworkStatus }}</span>
    </div>
    <div class="line">
      <span class="count">共计 {{homework.question_count}} 题</span>
      <span class="time">{{homework.idate}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    homework: {
      required: true
    }
  },
  methods: {
    /**
     * @description: 根据状态跳转到该练习的页面
     * @param {type}
     * @return:
     */

    to_homework() {
      if (['init', 'doing'].includes(this.homework.status)) {
        this.$router.replace({ name: 'homework_start', params: { homework_id: this.homework.id } })
      } else {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.homework-item {
  width: calc(100% - 30px);
  margin: 15px 0;
  padding: 15px;
  background: #fff;
  border-radius: 10px;

  .line {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;

    .title {
      color: #474e60;
      font-size: 13px;
      display: block;
      width: 70vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status {
      font-size: 11px;

      &.init {
        color: #3296fa;
      }

      &.pending {
        color: #c3bed4;
      }

      &.finished {
        color: #767789;
      }

      &.doing {
        color: #7bbfea;
      }

      &.undo {
        color: #f17c67;
      }
    }

    .count {
      color: #767789;
      font-size: 11px;
    }

    .time {
      color: #767789;
      font-size: 11px;
    }

    &:first-child {
      margin-bottom: 10px;
    }
  }
}
</style>