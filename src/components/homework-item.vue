<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-19 11:17:45
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-19 16:35:09
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="homework-item" @click="to_homework">
    <div class="line">
      <div class="title">方程式的加减运算方程式的加减运算方程式的加减运算方程式的加减运算方程式的加减运算方程式的加减运算方程式的加减运算方程式的加减运算</div>
      <span class="status">待完成</span>
    </div>
    <div class="line">
      <span class="count">共计 20 题</span>
      <span class="time">12月5日</span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    /**
     * @description: 根据状态跳转到该练习的页面
     * @param {type} 
     * @return: 
     */  
    to_homework() {
      this.$router.replace({ name: 'homework_start', params: { homework_id: 1 } })
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
      color: #ff7b4d;
      font-size: 11px;
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