<template>
  <view class="login">
    <image class="logo" src="/static/bg@2x.png" />

    <van-button class="login-btn" @click="auth" block round>微信一键登录</van-button>
    <van-button class="phone-btn" @click="navigateToPhone" block round>手机号安全登录</van-button>

    <protocol></protocol>
  </view>
</template>

<script setup lang="ts">
import { AuthAPIService } from '@/app/api/services/auth-api'
import protocol from '@/components/protocol.vue'
import Toast from '@/wxcomponents/toast/toast'

function auth() {
  wx.login({
    async success(code: string) {
      const { e, data } = await AuthAPIService.authControllerMemberLogin({ code })
      if (e) return
    },
    fail() {
      Toast.fail('一键登录失败')
    },
  })
}

function navigateToPhone() {
  wx.navigateTo({ url: '/pages/auth/phone' })
}
</script>

<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .logo {
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

  .login-btn {
    .van-button {
      background: #15ba11;
    }
  }
  .phone-btn {
    .van-button {
      background: #006241;
    }
  }
}
</style>
