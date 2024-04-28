<template>
  <div class="my-phone">
    <van-cell-group class="my-phone__cells">
      <van-field
        :value="phone"
        name="phone"
        placeholder="请输入新的手机号码"
        :border="false"
        label="+86"
        clearable
        :error-message="errorMessage"
        @change="phone = $event.detail"
      />
      <div class="split"></div>
      <van-field
        :value="code"
        name="code"
        placeholder="请输入手机验证码"
        :border="false"
        @change="code = $event.detail"
        use-button-slot
        center
        clearable
      >
        <span
          class="code"
          :class="[codeDisabled && 'is-disabed']"
          @click="sendCode"
          slot="button"
          >{{ codeText }}</span
        >
      </van-field>
    </van-cell-group>

    <van-button :disabled="btnDisabled" @click="onChecked" block round>确定</van-button>
  </div>
</template>

<script setup lang="ts">
import { AuthAPIService } from '@/app/api/services/auth-api'
import { MemberAPIService } from '@/app/api/services/member-api'
import { useUserStore } from '@/store/user'
import { getCode } from '@/utils/pay'
import { HideLoading, Loading, Toast } from '@/utils/toast'
import { computed, onUnmounted, ref } from 'vue'

const phone = ref('')
const code = ref('')
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
const btnDisabled = computed(() => !phone.value || errorMessage.value || !code.value)

const interval = setInterval(() => {
  if (waitTime.value) waitTime.value--
}, 1000)
onUnmounted(() => {
  console.log('onUnmounted')
  interval && clearInterval(interval)
})

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

async function onChecked() {
  Loading('保存中...')
  const { e } = await MemberAPIService.memberControllerUpdatePhone({
    phone: phone.value,
    code: code.value,
  })
  if (e) return HideLoading()
  await useUserStore().getUserDetail()
  HideLoading()
  Toast('修改成功')
  wx.navigateBack({ delta: 2 })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(my-phone) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  padding: 24rpx;

  @include e(cells) {
    .split {
      width: 624rpx;
      height: 2rpx;
      background-color: rgba(0, 0, 0, 0.1);
      margin: 0 32rpx;
    }
    .van-cell__title {
      min-width: 113rpx !important;
      flex: unset;
    }
    van-field {
      &:first-child {
        .van-cell {
          border-top-left-radius: 24rpx;
          border-top-right-radius: 24rpx;
        }
      }
      &:last-child {
        .van-cell {
          border-bottom-left-radius: 24rpx;
          border-bottom-right-radius: 24rpx;
        }
      }
      .van-cell {
        padding: 32rpx !important;
        &::after {
          z-index: 100;
        }

        .van-cell__value {
          position: relative;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 28rpx;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
          flex: 1;
          overflow: visible;
          z-index: 100;
        }
      }
    }

    .van-field__error-message {
      position: absolute;
      top: 40rpx;
      left: 0;
      z-index: 100;
    }

    .code {
      color: #000;
      &.is-disabed {
        color: #999999;
      }
    }
  }

  .van-button {
    width: 686rpx;
    height: 96rpx;
    border-radius: 48rpx;
    margin-top: 48rpx;

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
