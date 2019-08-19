<!--
 * @Author: yokins·shi(施永坚)
 * @Description: 改革春风吹满地，搬起砖来不吃力
 * @Date: 2019-08-16 16:12:29
 * @LastEditTime: 2019-08-19 14:26:55
 -->
 <template>
  <div class="app" id="app">
    <router-view v-transition></router-view>
    <app-tabbar v-if="showTabbar"></app-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  computed: {
    showTabbar() {
      return this.$route.meta.need_tabbar
    }
  }
}
</script>

<style lang="scss" scope>
</style>