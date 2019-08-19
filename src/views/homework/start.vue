<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:47:43
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-19 16:17:24
 * @Incantation: Buddha Bless Do Not Bugs
 -->

<template>
  <div class="page homework-start">
    <div class="close-line">
      <van-icon class-prefix="wm" name="close" style="font-size: 20px;"></van-icon>
    </div>

    <div class="introduce">
      <div class="title">练习马上开始</div>
      <div class="title last">深呼吸调整好自己的最佳状态</div>

      <div class="tip">如需打印题目，可点击下方转发按钮发送至微信</div>
      <div class="tip">注意查看答案识别是否正确</div>
      <div class="tip">有些题目需要填写多个答案，不要忘了哦~</div>
    </div>

    <div class="img-with-summary">
      <div class="summary">
        练习共
        <span>12</span> 题，涉及
        <span>23</span> 个知识点
      </div>
      <div class="vector"></div>
    </div>

    <van-row class="btn-line" gutter="15">
      <van-col span="8">
        <van-button round block size="small" type="warning">转发打印</van-button>
      </van-col>
      <van-col span="16">
        <van-button round block size="small" type="info">开始练习</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<style lang="scss" scoped>
.homework-start {
  background: #fff;
  padding: 15px 15px 0;
  min-height: calc(100vh - 15px);
  height: calc(100vh - 15px);
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;

  .close-line {
    display: flex;
    flex-flow: row nowrap;
    margin-bottom: 20px;
  }

  .introduce {
    display: flex;
    flex-flow: column nowrap;
    margin-bottom: 20px;

    .title {
      font-size: 18px;
      color: #474e60;
      font-weight: bolder;
      margin-bottom: 7px;

      &.last {
        margin-bottom: 10px;
      }
    }

    .tip {
      color: #767789;
      position: relative;
      font-size: 12px;
      margin-bottom: 10px;
      padding-left: 10px;

      &::before {
        content: '';
        position: absolute;
        width: 4px;
        left: 0;
        height: 100%;
        background: #3296fa;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .img-with-summary {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    .summary {
      color: #474e60;
      font-weight: bolder;
      font-size: 16px;
      text-align: center;
      margin-bottom: 15px;
      span {
        color: #3296fa;
      }
    }

    .vector {
      width: 100%;
      height: 200px;
      background-image: url('../../assets/images/vector.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  .btn-line {
    margin-bottom: 25px;
  }
}
</style>