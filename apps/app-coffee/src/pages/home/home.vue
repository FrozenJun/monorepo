<template>
  <div class="home">
    <div class="home__top">
      <image class="home__img" src="/static/banner@2x.png" />

      <div class="home__info" :class="[isLogin && 'is-logined']">
        <image v-if="!isLogin" class="home__info-bg" src="/static/home-bg@2x.png" />

        <div v-if="!isLogin" class="home__info-default">
          <div class="left">
            <image src="/static/home-logo@2x.png" />
            <div class="text">Hi，把四季的幸运送给你</div>
          </div>
          <van-button block round @tap="goLogin">注册/登录</van-button>
        </div>

        <div v-else class="home__info-logined">
          <image class="avatar" :src="userInfo?.avatarUrl" :alt="userInfo?.nickname" />
          <div class="info">
            <div class="number">{{ userInfo?.pickupCodeCount || 0 }}</div>
            <div class="name">提货码</div>
          </div>
          <div class="info">
            <div class="number">{{ userInfo?.balance || 0 }}</div>
            <div class="name">余额(元)</div>
          </div>
        </div>
      </div>
    </div>

    <image class="home__pay" src="/static/pay@2x.png" @tap="goPay" />

    <div class="home__code">
      <div class="home__code-head">
        <div class="title">购码更划算 <image src="/static/code7@2x.png" /></div>

        <div class="more" @tap="goPickup">更多优惠<image src="/static/arr-right@2x.png" /></div>
      </div>

      <div class="home__code-main">
        <div v-for="i in pickups" :key="i.id" class="item">
          <div class="item-left">
            <div class="name">提货码{{ i.count }}张</div>
            <div class="desc">每杯低至{{ i.price }}元</div>
            <div class="discount">已优惠{{ i.discount }}元</div>
          </div>

          <div class="item-right">
            <div class="price">
              <div class="origin">{{ PICKUP_ORIGIN_PRICE * i.count }}元</div>
              <div class="strong">{{ i.amount }}</div>
              <div class="unit">元</div>
            </div>
            <van-button block round @tap="buyPickup(i)">购买</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PickupCodeAPIService } from '@/app/api/services/pickup-code-api'
import { PickupCodeComboAPIService } from '@/app/api/services/pickup-code-combo-api'
import { PICKUP_ORIGIN_PRICE } from '@/app/constant/global'
import { useAuthStore } from '@/store/auth'
import { useUserStore } from '@/store/user'
import { payPickup } from '@/utils/pay'
import { HideLoading, Loading, Toast } from '@/utils/toast'
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const userStore = useUserStore()

const isLogin = computed(() => authStore.token)
const userInfo = computed(() => userStore.userInfo)

onShow(() => {
  getUserInfo()
  getAllPickup()
})
function getUserInfo() {
  isLogin.value && userStore.getUserDetail()
}
function goLogin() {
  wx.navigateTo({ url: '/pages/auth/login' })
}
function goPay() {
  validateLogin() && wx.navigateTo({ url: '/pages/balance/balance-recharge' })
}
function goPickup() {
  wx.switchTab({ url: '/pages/pickup/pickup-code' })
}

const pickups = ref<any[]>([])
function buyPickup({ id, count, amount }: any) {
  validateLogin() &&
    payPickup(id, () => {
      Toast('购买成功')
      wx.navigateTo({
        url: `/pages/pickup/pickup-buy?count=${count}&amount=${amount}`,
      })
    })
}
async function getAllPickup() {
  const { e, data } = await PickupCodeComboAPIService.pickupCodeComboControllerGetAll()
  if (e || !data) return
  pickups.value = data.map((i) => ({
    ...i,
    amount: i.amount / 100,
    price: Math.round((i.amount / 100 / i.count) * 100) / 100,
    discount: (PICKUP_ORIGIN_PRICE - i.amount / 100) * i.count,
  }))
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

@include b(home) {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;

  @include e(top) {
    position: relative;
    width: 100%;
    height: 596rpx;
    margin-bottom: 24rpx;

    @include e(img) {
      left: 0;
      top: 0;
      position: absolute;
      height: 580rpx;
      width: 100%;
      z-index: 0;
    }

    @include e(info) {
      width: 686rpx;
      height: 148rpx;
      margin: 0 auto;
      position: relative;
      margin-top: 448rpx;
      background-color: #fff;
      border-radius: 16rpx;

      @include e(info-bg) {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
      }

      @include e(info-default) {
        z-index: 100;
        width: 100%;
        height: 100%;
        display: flex;
        box-sizing: border-box;
        padding: 30rpx 32rpx;
        position: relative;
        align-items: center;

        .left {
          flex: 1;
          display: flex;
          flex-direction: column;

          image {
            width: 158rpx;
            height: 40rpx;
            margin-bottom: 8rpx;
          }
          .text {
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 24rpx;
            color: #333333;
            line-height: 40rpx;
            text-align: left;
            font-style: normal;
          }
        }

        .van-button {
          width: 156rpx;
          height: 56rpx;
          background: #006241;
          border-radius: 28rpx;
          padding: 0 24rpx;
        }
        .van-button__text {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #ffffff;
          text-align: center;
          font-style: normal;
        }
      }
      @include e(info-logined) {
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
        justify-content: space-between;
        padding: 0 96rpx 0 48rpx;
        align-items: center;
        .avatar {
          width: 96rpx;
          height: 96rpx;
          border-radius: 50%;
          margin-right: 36rpx;
        }
        .info {
          display: flex;
          flex-direction: column;
          .number {
            font-family: DINPro, DINPro;
            font-weight: bold;
            font-size: 48rpx;
            color: #004026;
            line-height: 62rpx;
            text-align: left;
            font-style: normal;
          }
          .name {
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 28rpx;
            color: #666666;
            line-height: 40rpx;
            text-align: left;
            font-style: normal;
          }
        }
      }
    }
  }

  @include e(pay) {
    width: 686rpx;
    height: 178rpx;
    margin-bottom: 24rpx;
  }

  @include e(code) {
    width: 686rpx;
    height: 354rpx;
    background-color: #fff;

    @include e(code-head) {
      width: 100%;
      height: 70rpx;
      display: flex;
      justify-content: space-between;
      padding: 28rpx 24rpx 0;
      align-items: center;
      box-sizing: border-box;
      margin-bottom: 34rpx;

      .title {
        display: flex;
        align-items: end;

        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 34rpx;
        color: #000000;
        line-height: 48rpx;
        text-align: left;
        font-style: normal;
        image {
          width: 24rpx;
          height: 42rpx;
          margin-left: 12rpx;
        }
      }

      .more {
        display: flex;
        align-items: center;

        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 34rpx;
        text-align: left;
        font-style: normal;

        image {
          width: 24rpx;
          height: 24rpx;
        }
      }
    }

    @include e(code-main) {
      width: 100%;
      margin-bottom: 60rpx;
      padding-left: 24rpx;
      overflow-y: auto;
      display: flex;

      .item {
        width: 532rpx;
        min-width: 532rpx;
        height: 190rpx;
        background: #f8faf3;
        border-radius: 16rpx;
        padding: 32rpx;
        margin-right: 16rpx;
        display: flex;
        justify-content: space-between;
      }
      .item-left {
        display: flex;
        flex-direction: column;
        .name {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 28rpx;
          color: #006241;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
          margin-bottom: 8rpx;
        }
        .desc {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #666666;
          line-height: 34rpx;
          text-align: left;
          font-style: normal;
          margin-bottom: 8rpx;
        }
        .discount {
          height: 32rpx;
          background: #fe6f21;
          border-radius: 8rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 22rpx;
          color: #ffffff;
          line-height: 32rpx;
          text-align: center;
          font-style: normal;
          width: fit-content;
          padding: 0 8rpx;
        }
      }
      .item-right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        .price {
          margin-bottom: 16rpx;
          display: flex;
          align-items: flex-end;
        }
        .origin {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 1;
          text-align: left;
          font-style: normal;
          text-decoration-line: line-through;
          margin-right: 8rpx;
        }
        .strong {
          font-weight: 600;
          font-size: 40rpx;
          font-family: PingFangSC, PingFang SC;
          color: #006241;
          line-height: 1;
          text-align: left;
          font-style: normal;
        }
        .unit {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #006241;
          line-height: 1;
          text-align: left;
          font-style: normal;
        }

        .van-button {
          background: #fff;
          border-radius: 28rpx;
          padding: 0 24rpx;

          width: 120rpx;
          height: 48rpx;
          border-radius: 24rpx;
          border: 2rpx solid #006241;

          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 24rpx;
          color: #006241;
          line-height: 34rpx;
          text-align: left;
          font-style: normal;
        }
      }
    }
  }
}
</style>
