<template>
  <div class="pickup-choose">
    <van-radio-group :value="radio" class="pickup-choose__main">
      <div class="item" v-for="i in unusedPickups" :key="i.code" @tap="changeCode(i.code)">
        <image src="/static/pickup-bg@2x.png" />
        <div class="name">提货码</div>
        <div class="code">{{ i.code }}</div>
        <van-radio :name="i.code" checked-color="#F95731" />
      </div>
    </van-radio-group>

    <van-field
      class="pickup-choose__field"
      :value="field"
      placeholder="手动输入"
      @change="field = $event.detail"
    />

    <div class="pickup-choose__bottom">
      <van-button @tap="check">确认选择</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { onShow } from '@dcloudio/uni-app'
import { computed } from 'vue'
import { ref } from 'vue'
import { PickupCodeAPIService } from '@/app/api/services/pickup-code-api'

const authStore = useAuthStore()
const isLogin = computed(() => authStore.token)
const radio = ref('')
const field = ref('')
const unusedPickups = ref<any[]>([])

onShow(() => {
  validateLogin() && getUnusedPickups()
})
async function getUnusedPickups() {
  const { e, data } = await PickupCodeAPIService.pickupCodeControllerGetMemberUnused()
  if (e || !data) return
  unusedPickups.value = new Array(12).fill(data[0])
}

function validateLogin() {
  if (!isLogin.value) {
    wx.navigateTo({ url: '/pages/auth/login' })
  } else {
    return true
  }
}
function changeCode(code: string) {
  radio.value = code
}
function check() {}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(pickup-choose) {
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f7f7f7;
  padding: 16rpx 32rpx 176rpx;

  @include e(main) {
    width: 686rpx;
    background: #ffffff;
    border-radius: 16rpx;
    position: relative;
    padding: 48rpx 32rpx 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32rpx;
    box-sizing: border-box;

    .item {
      margin-bottom: 32rpx;
      width: 622rpx;
      height: 92rpx;
      position: relative;
      padding: 26rpx 0 26rpx 54rpx;
      display: flex;
      align-items: center;

      image {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
      }
      .name {
        position: relative;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #f95731;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        margin-right: 132rpx;
      }
      .code {
        position: relative;
        font-family: DINPro, DINPro;
        font-weight: 500;
        font-size: 40rpx;
        color: #f95731;
        line-height: 52rpx;
        text-align: left;
        font-style: normal;
        margin-right: 96rpx;
      }
      .van-radio {
        position: relative;
      }
    }
  }

  @include e(field) {
    width: 686rpx;
    height: 104rpx;

    .van-cell {
      border-radius: 16rpx;
    }
  }

  @include e(bottom) {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    width: 750rpx;
    height: 176rpx;
    background: #ffffff;
    padding: 24rpx 64rpx;
    z-index: 1000;

    .van-button {
      width: 622rpx;
      height: 80rpx;
      background: #006241;
      border-radius: 48rpx;

      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      line-height: 44rpx;
      text-align: center;
      font-style: normal;
    }
  }
}
</style>
