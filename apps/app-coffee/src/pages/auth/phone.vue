<template>
  <view class="phone">
    <image class="logo" src="/static/bg@2x.png" />

    <van-field
      class="field"
      :value="phone"
      name="phone"
      placeholder="请输入新的手机号码"
      :border="false"
      @change="phone = $event.detail"
      error-message="手机号格式错误"
    />
    <van-field
      class="field"
      :value="code"
      name="code"
      placeholder="请输入手机验证码"
      :border="false"
      @change="code = $event.detail"
      use-button-slot
      center
      clearable
    >
      <span @click="sendCode" slot="button">获取验证码</span>
    </van-field>

    <protocol></protocol>

    <van-button @click="onRegister" block round>确定</van-button>
  </view>
</template>

<script setup lang="ts">
import protocol from '@/components/protocol.vue'
import { ref } from 'vue'

const phone = ref('')
const code = ref('')

function sendCode() {}

function onRegister() {}
</script>

<style lang="scss">
.phone {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-color: #eee;

  .logo {
    height: 616rpx;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 76rpx;
  }

  .field {
    width: 654rpx;
    height: 104rpx;
    background: #f7f7f7;
    border-radius: 56rpx;
    margin-bottom: 48rpx;

    .van-cell {
      width: 100%;
      height: 104rpx;
      border-radius: 56rpx;
      padding: 32rpx 48rpx;
    }
    .van-cell__value,
    .van-field__body {
      padding: 0;
      height: 40rpx;
    }
    .van-cell__value {
      overflow: visible;
    }
  }

  .van-button {
    width: 654rpx;
    height: 96rpx;
    border-radius: 48rpx;
    margin: 48rpx;

    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    line-height: 44rpx;
    font-style: normal;
    background: #006241;
  }
}
</style>
