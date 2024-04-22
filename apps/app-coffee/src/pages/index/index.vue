<template>
  <view class="content">
    <image class="logo" src="/static/bg@2x.png" />

    <van-button class="login-btn" @click="onClick" block round>微信一键登录</van-button>
    <van-button class="phone-btn" @click="onClick" block round>手机号安全登录</van-button>

    <!-- <van-checkbox>我已阅读</van-checkbox> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello')

function onClick() {
  console.log(11111111)
}
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .van-button {
    width: 654rpx;
    height: 96rpx;
    background: #006241;
    border-radius: 48rpx;
    margin: 0 48rpx 46rpx;
  }

  .logo {
    height: 616rpx;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 76rpx;
  }
}

.login-btn {
  .van-button {
    width: 654rpx;
    height: 96rpx;
    background: #15ba11;
    border-radius: 48rpx;
    margin: 0 48rpx 48rpx;
    color: #fff;
  }
}
.phone-btn {
  .van-button {
    width: 654rpx;
    height: 96rpx;
    background: #006241;
    border-radius: 48rpx;
    margin: 0 48rpx 46rpx;
    color: #fff;
  }
}
</style>
