<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:48:02
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-21 15:29:34
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page homework-loading" id="homework-loading">
    <div class="load-number">{{ time }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 3
    }
  },

  created() {
    this.loaded()
  },

  methods: {
    /**
     * @description: 加载完成
     * @param {type}
     * @return:
     */
    loaded() {
      const _this = this
      const countdown = setInterval(() => {
        if (_this.time !== 1) {
          _this.time = _this.time - 1
        } else {
          _this.time = 'GO'
        }
      }, 1000)
      setTimeout(() => {
        clearInterval(countdown)
        _this.$router.replace({
          name: 'homework_question_do',
          params: { homework_id: _this.$route.params.homework_id, question_id: 1 }
        })
      }, 3500)
    }
  }
}
</script>

<style lang="scss">
.homework-loading {
  background: #fff;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  .load-number {
    width: 180px;
    height: 180px;
    border: 5px solid rgba(50, 150, 250, 1);
    border-radius: 180px;
    font-size: 100px;
    color: #3296fa;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  }
}
</style>