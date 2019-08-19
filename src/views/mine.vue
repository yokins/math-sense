<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:46:35
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-19 14:26:27
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page mine" id="mine">
    <div class="banner">
      <div class="banner-img"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  created() {},

  methods: {}
}
</script>

<style lang="scss">
.mine {
  .banner {
    padding: 10px 30px 0 15px;
    background: #3f8166;
    position: relative;
    .banner-img {
      height: 170px;
      background-image: url('../assets/images/mine-bg.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
}
</style>