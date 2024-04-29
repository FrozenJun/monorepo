<template>
  <div class="order-good">
    <div class="left">
      <image mode="aspectFill" src="/static/coffee.png" />

      <div class="info">
        <div class="name">{{ good.name }}</div>
        <div class="count">x {{ good.count }}</div>
      </div>
    </div>

    <div class="right">￥{{ good.amount / 100 }}</div>
  </div>
</template>

<script setup lang="ts">
import type { OrderGoods } from '@/app/api/models/order-goods'
import type { PropType } from 'vue'

defineProps({
  good: {
    type: Object as PropType<OrderGoods>,
    default: () => ({}),
  },
})
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(order-good) {
  width: 654rpx;
  height: 112rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;

    image {
      width: 112rpx;
      height: 112rpx;
      margin-right: 16rpx;
    }

    .info {
      display: flex;
      flex-direction: column;
      .name {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        margin-bottom: 16rpx;
      }
      .count {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        line-height: 34rpx;
        text-align: left;
        font-style: normal;
      }
    }
  }

  .right {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #333333;
    line-height: 44rpx;
    text-align: left;
    font-style: normal;
  }
}
</style>
