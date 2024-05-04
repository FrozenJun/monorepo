<template>
  <div class="order-settle">
    <div class="order-settle__container">
      <order-info :order="(data as any)"></order-info>

      <div class="order-settle__choose">
        <van-radio-group :value="radio">
          <van-cell-group>
            <van-cell clickable :data-name="OrderPayway.余额支付" @click="changePayway">
              <view class="title" slot="title" :class="[balanceDisabled && 'disabled']">
                <image src="/static/balance.png" />
                <div class="right">
                  <view class="text">余额（可用￥{{ userInfo?.balance || 0 }}）</view>
                  <div class="tip" @tap="toBuy">特惠充值活动进行中，立即充值</div>
                </div>
              </view>
              <van-radio
                :disabled="balanceDisabled"
                slot="right-icon"
                :name="OrderPayway.余额支付"
                checked-color="#006241"
              />
            </van-cell>
            <van-cell clickable :data-name="OrderPayway.微信支付" @click="changePayway">
              <view class="title" slot="title">
                <image src="/static/wc-pay.png" />
                <view class="text">微信支付</view>
              </view>
              <van-radio slot="right-icon" :name="OrderPayway.微信支付" checked-color="#006241" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </div>

    <div class="order-settle__pay">
      <div class="left">
        <div class="desc">合计：</div>
        <div class="unit">￥</div>
        <div class="number">{{ data?.amountText || '0.00' }}</div>
      </div>
      <van-button :disabled="paid" @tap="toPay">立即支付</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import OrderInfo from './order-info.vue'
import { useAuthStore } from '@/store/auth'
import { OrderAPIService } from '@/app/api/services/order-api'
import { Loading, HideLoading, Toast } from '@/utils/toast'
import type { OrderDetailVo } from '@/app/api/models/order-detail-vo'
import { onLoad } from '@dcloudio/uni-app'
import { OrderPayway, OrderStatus } from '@/app/api/services/enum'
import { useUserStore } from '@/store/user'
import { payOrder } from '@/utils/pay'

/**
 * 判断用户是否未登录与用户信息
 */
const authStore = useAuthStore()
const userStore = useUserStore()
const isLogin = computed(() => authStore.token)
const userInfo = computed(() => userStore.userInfo)

const paid = ref(false)
validateLogin()
function validateLogin() {
  if (!isLogin.value) {
    wx.navigateTo({ url: '/pages/auth/login' })
  } else {
    return true
  }
}

const order = ref<OrderDetailVo | undefined>()
const data = computed(() => {
  return {
    ...order.value,
    amountText: ((order.value?.amount || 0) / 100).toFixed(2),
  }
})
onLoad((query: any) => {
  if (!query.q) return Toast('订单入口错误')
  const q = decodeURIComponent(query.q) // 获取到二维码原始链接内容
  const id = getQueryVariable(q, 'id')
  if (!id) return Toast('订单ID不存在')
  getDetail(id)
})
async function getDetail(id: string) {
  Loading('加载中...')
  const { e, data } = await OrderAPIService.orderControllerGetOrderDetail({
    id,
  })
  HideLoading()
  if (e || !data) return
  if (data.status !== OrderStatus.未支付) {
    Toast('订单已支付')
    paid.value = true
  }
  order.value = data

  if (balanceDisabled.value) radio.value = OrderPayway.微信支付
}

/**
 * 支付切换
 */
const balanceDisabled = computed(() => {
  return data.value?.amount && data.value?.amount / 100 > (userInfo.value?.balance || 0)
})
const radio = ref(OrderPayway.余额支付)
function changePayway(e: any) {
  if (balanceDisabled.value && e.currentTarget.dataset?.name === OrderPayway.余额支付) return
  radio.value = e.currentTarget.dataset?.name
}

function toBuy() {
  validateLogin() && wx.navigateTo({ url: '/pages/balance/balance-recharge' })
}

/**
 * 支付
 */
async function toPay() {
  if (paid.value) return
  if (!data.value.id) return Toast('订单ID不存在')
  if (radio.value === OrderPayway.余额支付) {
    Loading('支付中...')
    const { e } = await OrderAPIService.orderControllerBalancePay({
      orderId: data.value.id,
    })
    HideLoading()
    if (e) return
    paySuccess()
  } else {
    payOrder(data.value.id, paySuccess)
  }
}
async function paySuccess() {
  await useUserStore().getUserDetail()
  Toast('支付成功')
  wx.redirectTo({
    url: `/pages/order/order-paid?id=${data.value.id}`,
  })
}
function getQueryVariable(url: string, variable: string) {
  let query = url.split('?')[1]
  if (!query) {
    return null
  }
  let vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return null
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(order-settle) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  padding: 24rpx;
  position: relative;

  @include e(container) {
    width: 100%;
    height: calc(100vh - 176rpx);
    overflow-y: auto;

    @include e(choose) {
      width: 702rpx;
      height: 226rpx;
      background: #ffffff;
      border-radius: 24rpx;
      margin-bottom: 24rpx;
      padding: 10rpx 0;

      van-cell {
        &:last-child {
          .van-cell {
            &::after {
              border: none;
            }
          }
        }
      }
      .van-cell {
        padding: 30rpx 32rpx;
      }
      .van-hairline--top-bottom:after {
        border: none;
      }

      .title {
        display: flex;
        align-items: flex-start;
        &.disabled {
          .text {
            color: #999;
          }
        }
        image {
          width: 40rpx;
          height: 40rpx;
          margin-right: 20rpx;
        }
        .text {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 28rpx;
          color: #000000;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
        }
        .right {
          display: flex;
          flex-direction: column;
          .tip {
            margin-top: 8rpx;
            height: 30rpx;
            border-radius: 6rpx;
            padding: 0 8rpx;
            border: 1rpx solid #ff2d19;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 20rpx;
            color: #ff2d19;
            line-height: 28rpx;
            text-align: left;
            font-style: normal;
          }
        }
      }
    }
  }

  @include e(pay) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 176rpx;
    padding: 24rpx 32rpx 70rpx;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .desc {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #000000;
        line-height: 44rpx;
        text-align: left;
        font-style: normal;
      }
      .unit {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #fe5500;
        line-height: 44rpx;
        text-align: left;
        font-style: normal;
      }
      .number {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 48rpx;
        color: #fe5500;
        line-height: 66rpx;
        text-align: left;
        font-style: normal;
      }
    }

    .van-button {
      width: 220rpx;
      height: 80rpx;
      background: #006241;
      border-radius: 48rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      line-height: 44rpx;
      text-align: left;
      font-style: normal;
    }
  }
}
</style>
