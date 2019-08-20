<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-20 09:20:36
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-20 09:54:18
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="progress-bar" id="progress-bar">
    <div class="cover" :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 10px;
  flex: 1;
  background: #EBEBEB;
  border-radius: 5px;
  position: relative;
  
  .cover {
    height: 10px;
    background: #3296FA;
    border-radius: 5px;
  }
}
</style>