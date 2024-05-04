<template>
  <div class="my">
    <image class="my__logo" src="/static/my-bg.png" />

    <div class="my__info">
      <div class="left">
        <image
          class="avatar"
          mode="aspectFill"
          :src="userInfo?.avatarUrl || '/static/my-default.png'"
        />
        <div v-if="isLogin" class="name">{{ userInfo?.nickname || '' }}</div>
        <div v-else @tap="validateLogin" class="name">登录/注册</div>
      </div>

      <image v-if="isLogin" @tap="toInfo" class="right" mode="aspectFill" src="/static/edit.png" />
    </div>

    <div v-if="isLogin" class="my__include">
      <div class="item" @tap="toPickup">
        <div class="number">{{ userInfo?.pickupCodeCount || 0 }}</div>
        <div class="name">提货码</div>
      </div>
      <div class="item" @tap="toBalance">
        <div class="number">{{ userInfo?.balance || 0 }}</div>
        <div class="name">余额(元)</div>
      </div>
    </div>

    <div class="my__other">
      <div class="item" @tap="toOrder">
        <image class="icon" src="/static/my-order.png" />
        <div class="name">我的订单</div>
        <image class="arrow" src="/static/arr-right@2x.png" />
      </div>
      <div class="item" @tap="toConsume">
        <image class="icon" src="/static/my-pay.png" />
        <div class="name">消费明细</div>
        <image class="arrow" src="/static/arr-right@2x.png" />
      </div>
      <div class="item" @tap="toConnect">
        <image class="icon" src="/static/my-ct.png" />
        <div class="name">联系我们</div>
        <image class="arrow" src="/static/arr-right@2x.png" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useUserStore } from '@/store/user'
import { onShow } from '@dcloudio/uni-app'
import { computed } from 'vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const isLogin = computed(() => authStore.token)
const userInfo = computed(() => userStore.userInfo)

onShow(() => {
  getUserInfo()
})
function getUserInfo() {
  isLogin.value && userStore.getUserDetail()
}

function toInfo() {
  wx.navigateTo({
    url: `/pages/my/personal?nickname=${userInfo.value?.nickname}&phone=${userInfo.value?.phone}&avatar=${userInfo.value?.avatarUrl}`,
  })
}
function toConnect() {
  wx.navigateTo({ url: '/subpages/my/connect' })
}
function toConsume() {
  validateLogin() && wx.navigateTo({ url: '/pages/my/consume' })
}
function toOrder() {
  validateLogin() && wx.navigateTo({ url: '/pages/order/order' })
}
function toPickup() {
  validateLogin() && wx.switchTab({ url: '/pages/pickup/pickup-code' })
}
function toBalance() {
  validateLogin() && wx.navigateTo({ url: '/pages/balance/balance' })
}

function validateLogin() {
  if (!isLogin.value) {
    wx.navigateTo({ url: '/pages/auth/login' })
  } else {
    return true
  }
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(my) {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx;
  background: #f7f7f7;

  @include e(logo) {
    position: absolute;
    left: 0;
    top: 0;
    height: 504rpx;
    width: 100%;
    z-index: 0;
  }

  @include e(info) {
    width: 100%;
    position: relative;
    margin-top: 184rpx;
    margin-bottom: 60rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;

      .avatar {
        width: 112rpx;
        height: 112rpx;
        margin-right: 28rpx;
        border-radius: 50%;
      }
      .name {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 36rpx;
        color: #ffffff;
        line-height: 50rpx;
        text-align: left;
        font-style: normal;
      }
    }
    .right {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
    }
  }

  @include e(include) {
    position: relative;
    width: 686rpx;
    height: 192rpx;
    background: #ffffff;
    border-radius: 16rpx;
    display: flex;
    justify-content: space-between;
    padding: 46rpx 136rpx 40rpx;
    margin-bottom: 24rpx;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .number {
        font-family: DINPro, DINPro;
        font-weight: bold;
        font-size: 48rpx;
        color: #004026;
        line-height: 62rpx;
        font-style: normal;
        margin-bottom: 4rpx;
      }
      .name {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        line-height: 40rpx;
        font-style: normal;
      }
    }
  }

  @include e(other) {
    width: 686rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 16rpx 0;
    display: flex;
    flex-direction: column;
    position: relative;

    .item {
      width: 100%;
      padding: 32rpx;
      display: flex;
      align-items: center;
      .icon {
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
  }
}
</style>
