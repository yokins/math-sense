<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-19 13:57:35
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-19 14:17:50
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <van-tabbar class="app-tabbar" id="app-tabbar" fixed border :z-index="1000" route safe-area-inset-bottom>
    <van-tabbar-item v-for="(item, index) in menus" :key="index" replace :to="item.path">
      <span>{{item.text}}</span>
      <img slot="icon" slot-scope="props" :src="props.active ? item.icon.active : item.icon.normal" />
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        {
          text: '练习',
          path: '/',
          icon: {
            normal: require('@/assets/images/list.png'),
            active: require('@/assets/images/list-active.png')
          }
        },
        {
          text: '我的',
          path: '/mine',
          icon: {
            normal: require('@/assets/images/mine.png'),
            active: require('@/assets/images/mine-active.png')
          }
        }
      ]
    }
  }
}
</script>