<template>
  <view class="phone">
    <back></back>

    <image class="phone__logo" src="/static/phone-bg.png" />

    <van-field
      class="phone__field"
      :value="phone"
      name="phone"
      placeholder="请输入手机号码"
      :border="false"
      clearable
      @change="phone = $event.detail"
      :error-message="errorMessage"
    />
    <van-field
      class="phone__field"
      :value="code"
      name="code"
      placeholder="请输入手机验证码"
      :border="false"
      @change="code = $event.detail"
      use-button-slot
      center
      clearable
    >
      <span class="code" :class="[codeDisabled && 'is-disabed']" @click="sendCode" slot="button">{{
        codeText
      }}</span>
    </van-field>

    <protocol @checked-change="onCheckedChange"></protocol>

    <van-button :disabled="btnDisabled" @click="onRegister" block round>确定</van-button>

    <image class="phone__bg" src="/static/login-bg.png" />
  </view>
</template>

<script setup lang="ts">
import protocol from '@/components/protocol.vue'
import back from '@/components/back.vue'
import { computed, ref } from 'vue'
import { HideLoading, Loading, Toast } from '@/utils/toast'
import { getCode } from '@/utils/pay'
import { AuthAPIService } from '@/app/api/services/auth-api'
import { onUnmounted } from 'vue'
import { useAuthStore } from '@/store/auth'

const phone = ref('')
const code = ref('')
const checked = ref(false)
const waitTime = ref(0)

const errorMessage = computed(() => {
  const valid =
    !phone.value ||
    /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0189])\d{8}$/.test(phone.value)
  return valid ? '' : '手机号格式错误'
})
const codeText = computed(() => {
  return waitTime.value ? `${waitTime.value}s后重新获取` : '获取验证码'
})
const codeDisabled = computed(() => !phone.value || errorMessage.value || waitTime.value)
const btnDisabled = computed(
  () => !phone.value || errorMessage.value || !code.value || !checked.value
)
const interval = setInterval(() => {
  if (waitTime.value) waitTime.value--
}, 1000)
onUnmounted(() => interval && clearInterval(interval))

async function sendCode() {
  if (!phone.value) {
    return Toast('请输入手机号')
  }
  if (errorMessage.value) {
    return Toast('请输入正确的手机号')
  }
  if (waitTime.value) return
  Loading('发送中...')
  const code = await getCode()
  if (code) {
    const { e } = await AuthAPIService.authControllerSendValidateCode({ phone: phone.value, code })
    HideLoading()
    if (e) return
    Toast('验证码已发送')
    waitTime.value = 60
  } else {
    HideLoading()
  }
}
function onCheckedChange(v: any) {
  checked.value = v
}
function onRegister() {
  useAuthStore().phoneLogin(phone.value, code.value)
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(phone) {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-color: #eee;

  @include e(logo) {
    height: 492rpx;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 48rpx;
  }

  @include e(field) {
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

    .code {
      color: #000;
      &.is-disabed {
        color: #999999;
      }
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

  @include e(bg) {
    position: absolute;
    bottom: 30rpx;
    right: 20rpx;
    width: 256rpx;
    height: 226rpx;
  }
}
</style>
