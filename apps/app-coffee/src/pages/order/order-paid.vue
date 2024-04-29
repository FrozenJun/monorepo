<template>
  <div class="order-paid">
    <image src="/static/order-buy.png" />

    <div class="msg">支付成功</div>
    <div class="desc">咖啡制作中，请稍等～</div>

    <van-cell-group class="cells">
      <van-cell title="实付" :value="data.amountText" />
      <van-cell title="支付方式" :value="data.paywayText" />
      <van-cell title="支付时间" :value="data.payTime" />
      <van-cell title="订单编号" :value="data.id" />
      <van-cell title="设备" :value="data.deviceInfo?.name || '未知设备'" />
    </van-cell-group>

    <van-button @tap="toConnect">联系客服</van-button>
  </div>
</template>

<script setup lang="ts">
import type { OrderDetailVo } from '@/app/api/models/order-detail-vo'
import { OrderPayway } from '@/app/api/services/enum'
import { OrderAPIService } from '@/app/api/services/order-api'
import { Loading, HideLoading } from '@/utils/toast'
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { ref, computed } from 'vue'

const order = ref<OrderDetailVo | undefined>()
const data = computed(() => {
  let paywayText
  switch (order.value?.payway) {
    case OrderPayway.余额支付:
      paywayText = '余额支付'
      break
    case OrderPayway.微信支付:
      paywayText = '微信支付'
      break
    case OrderPayway.提货码:
      paywayText = '提货码支付'
  }
  return {
    ...order.value,
    paywayText,
    amountText: `￥${(order.value?.amount || 0) / 100}`,
    payTime: dayjs(order.value?.payAt).format('YYYY-MM-DD HH:mm:ss'),
  }
})
onLoad((params: any) => {
  getDetail(params.id)
})
async function getDetail(id: string) {
  Loading('加载中...')
  const { e, data } = await OrderAPIService.orderControllerGetOrderDetail({
    id,
  })
  HideLoading()
  if (e || !data) return
  order.value = data
}

function toConnect() {
  wx.navigateTo({ url: '/pages/my/connect' })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(order-paid) {
  width: 750rpx;
  height: 100vh;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;

  image {
    width: 188rpx;
    height: 146rpx;
    margin-top: 80rpx;
    margin-bottom: 32rpx;
  }

  .msg {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 40rpx;
    color: #333333;
    line-height: 56rpx;
    text-align: left;
    font-style: normal;
  }
  .desc {
    margin-top: 16rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #666666;
    line-height: 44rpx;
    text-align: center;
    font-style: normal;
    margin-bottom: 64rpx;
  }

  .cells {
    width: 702rpx;
    background: #ffffff;
    border-radius: 24rpx;
    margin-bottom: 80rpx;

    .van-cell {
      &::after {
        z-index: 100;
      }
      &:first-child {
        border-top-left-radius: 24rpx;
        border-top-right-radius: 24rpx;
      }
      &:last-child {
        border-bottom-left-radius: 24rpx;
        border-bottom-right-radius: 24rpx;
      }
    }

    .van-cell__value {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #000000;
      line-height: 40rpx;
      text-align: right;
      font-style: normal;
    }
  }

  .van-button {
    width: 422rpx;
    height: 96rpx;
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
</style>
