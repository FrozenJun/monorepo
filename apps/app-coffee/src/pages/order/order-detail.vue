<template>
  <div class="order-detail">
    <div class="order-detail__top">
      <div class="status">{{ data.isCancle ? '已退款' : '订单已完成' }}</div>

      <div v-if="data.isPartOk" class="top-other">
        <div class="left">部分退款成功</div>
        <div class="right">￥{{ data.refundedAmount }}</div>
      </div>
    </div>

    <order-info :order="(data as any)"></order-info>

    <div class="order-detail__detail">
      <van-cell-group class="cells">
        <van-cell title="订单编号" :value="data.id" />
        <van-cell title="下单时间" :value="data.createTime" />
        <van-cell title="支付方式" :value="data.paywayText" />
        <van-cell
          v-if="data.payway === OrderPayway.提货码"
          title="提货码"
          :value="data.pickupCode"
        />
        <van-cell title="支付时间" :value="data.payTime" />
        <van-cell v-if="data.isCancle" title="退款时间" :value="data.refundTime" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import OrderInfo from './order-info.vue'
import { ref } from 'vue'
import { HideLoading, Loading } from '@/utils/toast'
import { OrderAPIService } from '@/app/api/services/order-api'
import type { OrderDetailVo } from '@/app/api/models/order-detail-vo'
import dayjs from 'dayjs'
import { OrderPayway, OrderStatus } from '@/app/api/services/enum'
import { computed } from 'vue'

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
    isOk: order.value?.status === OrderStatus.已完成,
    isPartOk: order.value?.status === OrderStatus.部分退款,
    isCancle: order.value?.status === OrderStatus.已退款,
    paywayText,
    createTime: dayjs(order.value?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    payTime: dayjs(order.value?.payAt).format('YYYY-MM-DD HH:mm:ss'),
    refundTime: dayjs(order.value?.refundAt).format('YYYY-MM-DD HH:mm:ss'),
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
  if (e) return
  order.value = data
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(order-detail) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  padding: 24rpx;

  @include e(top) {
    width: 702rpx;
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;

    .status {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 36rpx;
      color: #000000;
      line-height: 50rpx;
      text-align: left;
      font-style: normal;
    }
    .top-other {
      margin-top: 32rpx;
      width: 638rpx;
      height: 66rpx;
      background: rgba(#d8d8d8, 0.15);
      border-radius: 8rpx;
      padding: 14rpx 32rpx 12rpx 24rpx;
      display: flex;
      justify-content: space-between;
      .left {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
      }
      .right {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 28rpx;
        color: #fe5500;
        line-height: 40rpx;
        text-align: right;
        font-style: normal;
      }
    }
  }

  @include e(detail) {
    background-color: #fff;
    border-radius: 24rpx;
  }
}
</style>
