<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:46:35
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-11-01 17:02:25
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
        <div v-if="list.length <= 0 && !isLoading" class="placeholder">没有练习哦~</div>
        <homework-item v-for="(item, index) in list" :key="index" :homework="item"></homework-item>
      </van-pull-refresh>
    </div>

    <van-popup round v-model="show" :close-on-click-overlay="false">
      <div class="version">
        <div class="top">
          <van-image class="p-img" width="50" height="30" :src="require('../assets/images/home-cv.png')" />
          V{{version.name}}版本升级
          <van-image class="r-img" width="40" height="50" :src="require('../assets/images/home-cvr.png')" />
        </div>

        <div class="content">
          <div class="desc">{{ showVersionDesc }}</div>
          <van-grid :border="false" :column-num="buttonNumber">
            <van-grid-item v-if="['force', 'recommend'].includes(version.upgrade_type)">
              <van-button block type="info" size="small" @click="toUpdate">立即更新</van-button>
            </van-grid-item>
            <van-grid-item v-if="['recommend', 'notice'].includes(version.upgrade_type)">
              <van-button
                block
                type="default"
                size="small"
                @click="toCancelUpdate"
              >{{ version.upgrade_type === 'recommend' ? '取消更新' : '我已知晓' }}</van-button>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapState } from 'vuex';
export default {
  data() {
    return {
      list: [],
      total_wrong_count: 0,
      isLoading: false,
      show: false,
      version: ''
    };
  },

  computed: {
    ...mapState(['current_user', 'hadCheckUpdate']),
    /**
     * @description: 显示版本详情
     * @param {type}
     * @return:
     */
    showVersionDesc() {
      if (this.version && this.version.desc) {
        return this.version.desc.replace(/\n/gm, '<br/>');
      } else {
        return '';
      }
    },
    /**
     * @description: 处理显示的按钮
     * @param {type}
     * @return:
     */
    buttonNumber() {
      if (this.version) {
        switch (this.version.upgrade_type) {
          case 'force':
            return 1;
          case 'recommend':
            return 2;
          case 'notice':
            return 1;
          default:
            return 0;
        }
      } else {
        return 0;
      }
    }
  },

  created() {
    this.checkVersion();
    if (this.hadCheckUpdate) {
      this.initData();
    }
  },

  methods: {
    ...mapActions(['clean_doing_question', 'updatehadCheckVersion']),
    /**
     * @description: 检查版本
     * @param {type}
     * @return:
     */
    async checkVersion() {
      await axios
        .get(process.env.VUE_APP_UPLOAD_URL + 'version', {
          headers: {
            TOKEN: this.current_user.token
          }
        })
        .then(res => {
          this.version = res.data;
          if (this.checkVersionToUpdate(this.version)) {
            this.show = true;
          }
        });
    },
    /**
     * @description: 拉取首页数据
     * @param {type}
     * @return:
     */
    initData() {
      setTimeout(() => {
        this.$api.home().then(res => {
          this.list = res.homeworks;
          this.total_wrong_count = res.total_wrong_count;
          this.isLoading = false;
        });
      }, 500);
    },
    /**
     * @description: 清除doing_questions
     * @param {type}
     * @return:
     */
    cleanData() {
      this.clean_doing_question();
    },
    /**
     * @description: 跳转到浏览器下载
     * @param {type}
     * @return:
     */
    toUpdate() {
      this.updatehadCheckVersion(true);
      cordova.InAppBrowser.open(this.version.url, '_system', 'location=yes');
      // window.location.href = this.version.url
      // cordova.InAppBrowser.open('http://www.baidu.com', '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
    },
    /**
     * @description: 取消更新
     * @param {type}
     * @return:
     */
    toCancelUpdate() {
      this.updatehadCheckVersion(true);
      this.show = false;
    },
    /**
     * @description: 拿到version数据后检查是否要弹出更新框
     * @param {type}
     * @return:
     */
    checkVersionToUpdate(newVersion) {
      console.log(process.env.VUE_APP_VERSION);
      console.log(process.env.VUE_APP_TYPES);
      if (newVersion.types !== process.env.VUE_APP_TYPES) {
        return true;
      } else {
        let update = false;
        const newVs = newVersion.name.split('.');
        const oldVs = process.env.VUE_APP_VERSION.split('.');
        for (let index = 0; index < 3; index++) {
          const newV = newVs[index];
          const oldV = oldVs[index];
          console.log(parseInt(newV), parseInt(oldV));
          if (parseInt(newV) > parseInt(oldV)) {
            update = true;
            break;
          }
        }
        console.log(update);
        return update;
      }
    }
  }
};
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

  .van-popup--center {
    border-radius: 15px !important;
    overflow: inherit;
  }

  .version {
    border-radius: 15px;
    height: 300px;
    width: 250px;
    display: flex;
    flex-flow: column nowrap;

    .top {
      border-top-left-radius: 15px !important;
      border-top-right-radius: 15px !important;
      width: 100%;
      height: 40px;
      background: #3596fa;
      font-size: 14px;
      color: #fff;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      position: relative;

      .p-img {
        position: absolute;
        bottom: 0;
        left: 20px;
      }

      .r-img {
        position: absolute;
        top: -10px;
        right: 20px;
      }
    }
    .content {
      padding: 15px;
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;

      .desc {
        font-size: 14px;
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        padding-bottom: 15px;
      }
    }
  }
}
</style>