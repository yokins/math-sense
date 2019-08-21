<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:46:59
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-21 15:34:22
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page tree" id="tree">
    <van-nav-bar fixed :z-index="1000" title="成长树" left-arrow @click-left="onClickLeft" />
    
  </div>
</template>

<script>
export default {
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
    onClickRight() {}
  }
}
</script>