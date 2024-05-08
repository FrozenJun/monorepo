<template>
  <div class="connect">
    <div class="connect__item" @tap="callPhone">
      <image class="avatar" mode="aspectFill" src="/static/call.png" />
      <div class="name">致电客服</div>
      <image class="arrow" src="/static/arr-right@2x.png" />
    </div>

    <div class="connect__item" @tap="callHz">
      <image class="avatar" mode="aspectFill" src="/static/hezuo.png" />
      <div class="name">找我们合作</div>
      <image class="arrow" src="/static/arr-right@2x.png" />
    </div>

    <div class="connect__code">
      <image show-menu-by-longpress src="/static/wechat-code.png" />
      <div class="desc">长按二维码添加客服微信</div>
    </div>
  </div>
</template>

<script setup lang="ts">
function callPhone() {
  wx.makePhoneCall({
    phoneNumber: '13366151709',
  })
}
function callHz() {
  wx.makePhoneCall({
    phoneNumber: '13691197363',
  })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(connect) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  padding: 24rpx;
  display: flex;
  flex-direction: column;

  @include e(item) {
    width: 100%;
    padding: 32rpx;
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
    background: #ffffff;
    border-radius: 16rpx;
    image {
      width: 48rpx;
      height: 48rpx;
      margin-right: 16rpx;
    }
    .name {
      flex: 1;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #000000;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
    }
    .arrow {
      width: 32rpx;
      height: 32rpx;
    }
  }

  @include e(code) {
    width: 702rpx;
    height: 514rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 48rpx 194rpx 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    image {
      width: 320rpx;
      height: 320rpx;
      margin-bottom: 32rpx;
    }
    .desc {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      line-height: 34rpx;
      text-align: center;
      font-style: normal;
    }
  }
}
</style>
