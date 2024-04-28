<template>
  <view class="login">
    <back></back>

    <image class="login__logo" src="/static/bg@2x.png" />

    <van-button
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
      class="login__login-btn"
      block
      round
      :disabled="!checked"
      >微信一键登录</van-button
    >
    <van-button class="login__phone-btn" @click="navigateToPhone" block round
      >手机号安全登录</van-button
    >

    <protocol @checked-change="onCheckedChange"></protocol>

    <image class="login__bg" src="/static/login-bg.png" />
  </view>
</template>

<script setup lang="ts">
import protocol from '@/components/protocol.vue'
import back from '@/components/back.vue'
import { useAuthStore } from '@/store/auth'
import { ref } from 'vue'

const checked = ref(false)

async function getPhoneNumber(e: any) {
  await useAuthStore().login(e.detail.code)
}
function onCheckedChange(v: any) {
  checked.value = v
}

function navigateToPhone() {
  wx.navigateTo({ url: '/pages/auth/phone' })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';
@include b(login) {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f0f5f4 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  @include e(logo) {
    height: 616rpx;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 76rpx;
  }

  .van-button {
    width: 654rpx;
    height: 96rpx;
    border-radius: 48rpx;
    margin: 0 48rpx 46rpx;

    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    line-height: 44rpx;
    font-style: normal;
  }
  @include e(login-btn) {
    .van-button {
      background: #15ba11;
    }
  }
  @include e(phone-btn) {
    .van-button {
      background: #006241;
    }
  }

  @include e(bg) {
    position: absolute;
    bottom: 30rpx;
    right: 20rpx;
    width: 256rpx;
    height: 226rpx;
  }
}
</style>
