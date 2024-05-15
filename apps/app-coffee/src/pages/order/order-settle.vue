<template>
  <div class="order-settle">
    <div class="order-settle__container">
      <order-info :order="(data as any)"></order-info>

      <div class="order-settle__choose">
        <van-radio-group :value="radio">
          <van-cell-group>
            <van-cell clickable :data-name="OrderPayway.余额支付" @tap="changePayway">
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
            <van-cell clickable :data-name="OrderPayway.微信支付" @tap="changePayway">
              <view class="title" slot="title">
                <image src="/static/wc-pay.png" />
                <view class="text">微信支付</view>
              </view>
              <van-radio slot="right-icon" :name="OrderPayway.微信支付" checked-color="#006241" />
            </van-cell>

            <van-cell
              v-if="!pickupPayDisabled"
              clickable
              :data-name="OrderPayway.提货码"
              @tap="changePayway"
            >
              <view class="title" slot="title">
                <image src="/static/pickup-pay.png" />
                <view class="text">提货码支付</view>
              </view>
              <view class="pickup" slot="right-icon">
                <view @tap="toPickupChoose" class="code"
                  >{{ choosedPickup }}<van-icon name="arrow"
                /></view>
                <van-radio :name="OrderPayway.提货码" checked-color="#006241" />
              </view>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </div>

    <div class="order-settle__pay">
      <div class="left">
        <div class="desc">合计：</div>
        <div class="unit">￥</div>
        <div class="number">{{ amountView }}</div>
      </div>
      <van-button :disabled="paid" @tap="toPay">{{ paid ? '已支付' : '立即支付' }}</van-button>
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
import { PickupCodeAPIService } from '@/app/api/services/pickup-code-api'
import { onBeforeUnmount } from 'vue'

/**
 * 判断用户是否未登录与用户信息
 */
const authStore = useAuthStore()
const userStore = useUserStore()
const isLogin = computed(() => authStore.token)
const userInfo = computed(() => userStore.userInfo)
const unusedPickups = ref<any[]>([])
const choosedPickup = ref('')
const pickupChoosedPath = computed(() => {
  return `/pages/pickup/pickup-choose${choosedPickup.value ? `?code=${choosedPickup.value}` : ''}`
})

/**
 * 获取选择提货码页面选择的数据
 */
uni.$on('pickupChoose', (code: string) => {
  if (code) choosedPickup.value = code
})
onBeforeUnmount(() => {
  uni.$off('pickupChoose')
})

const paid = ref(false)

const order = ref<OrderDetailVo | undefined>()
const data = computed(() => {
  return {
    ...order.value,
    amountText: ((order.value?.amount || 0) / 100).toFixed(2),
  }
})
const amountView = computed(() => {
  return radio.value === OrderPayway.提货码 || !data.value.amountText
    ? '0.00'
    : data.value.amountText
})

onLoad(async (query: any) => {
  validateLogin()
  getUnusedPickups()
  if (!query.q) return Toast('订单入口错误')
  const q = decodeURIComponent(query.q) // 获取到二维码原始链接内容
  const id = getQueryVariable(q, 'id')
  if (!id) return Toast('订单ID不存在')
  Loading('加载中...')
  await Promise.all([getDetail(id), getUnusedPickups()])
  HideLoading()
  if (balanceDisabled.value) {
    radio.value = pickupPayDisabled.value ? OrderPayway.微信支付 : OrderPayway.提货码
  }
})

async function getDetail(id: string) {
  const { e, data } = await OrderAPIService.orderControllerGetOrderDetail({
    id,
  })
  if (e || !data) return
  if (data.status !== OrderStatus.未支付) {
    Toast('订单已支付')
    paid.value = true
  }
  order.value = data
}
async function getUnusedPickups() {
  const { e, data } = await PickupCodeAPIService.pickupCodeControllerGetMemberUnused()
  if (e || !data) return
  unusedPickups.value = data
  choosedPickup.value = data[0]?.code || ''
}
function validateLogin() {
  if (!isLogin.value) {
    wx.navigateTo({ url: '/pages/auth/login' })
  } else {
    return true
  }
}

/**
 * 支付切换
 */
const balanceDisabled = computed(() => {
  return data.value?.amount && data.value?.amount / 100 > (userInfo.value?.balance || 0)
})
const pickupPayDisabled = computed(() => {
  return (order.value as any)?.goodsCount !== 1 || !unusedPickups.value.length
})
const radio = ref(OrderPayway.余额支付)
function changePayway(e: any) {
  if (e.currentTarget.dataset?.name === OrderPayway.提货码 && !choosedPickup.value)
    return wx.navigateTo({ url: pickupChoosedPath.value })
  if (balanceDisabled.value && e.currentTarget.dataset?.name === OrderPayway.余额支付) return
  radio.value = e.currentTarget.dataset?.name
}

function toBuy() {
  validateLogin() && wx.navigateTo({ url: '/pages/balance/balance-recharge' })
}
function toPickupChoose(e: Event) {
  e.stopPropagation()
  wx.navigateTo({ url: pickupChoosedPath.value })
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
  } else if (radio.value === OrderPayway.提货码) {
    if (!choosedPickup.value) return Toast('请先选择提货码')
    Loading('支付中...')
    const { e } = await OrderAPIService.orderControllerPickupCodePay({
      orderId: data.value.id,
      pickupCode: choosedPickup.value,
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

      .pickup {
        display: flex;
        align-items: center;

        .code {
          height: 40rpx;
          border-radius: 20rpx;
          border: 2rpx solid rgba(#ff2d19, 0.2);
          display: flex;
          align-items: center;
          font-weight: 500;
          font-size: 24rpx;
          color: #ff2d19;
          line-height: 40rpx;
          text-align: center;
          font-style: normal;
          padding: 0 16rpx;
          margin-right: 24rpx;

          .van-icon {
            font-size: 28rpx;
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
