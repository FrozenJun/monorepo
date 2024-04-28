<template>
  <div class="order">
    <van-tabs :active="active" sticky>
      <van-tab title="全部">
        <div class="order__content">
          <order-item v-for="i in 6" :key="i"></order-item>
        </div>
      </van-tab>
      <van-tab title="已完成"
        ><van-empty description="暂无历史订单" image="/static/order-empty.png">
          <div class="empty">历史订单将会展示在这里\n请先去下单哦～</div>
          <van-button>去喝一杯</van-button>
        </van-empty></van-tab
      >
      <van-tab title="已退款">内容1 3</van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderItem from './order-item.vue'

const active = ref(0)
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(order) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;

  @include e(content) {
    width: 100%;
    padding: 24rpx;
    background: #f7f7f7;
  }
  .van-empty {
    padding-top: 180rpx;
    background: #f7f7f7;
    .van-empty__image,
    image {
      width: 330rpx;
      height: 256rpx;
    }
    .van-empty__description {
      margin-top: 46rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
    }
    .van-empty__bottom {
      margin-top: 24rpx;
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    .empty {
      width: 308rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
      line-height: 40rpx;
      text-align: center;
      font-style: normal;
    }

    .van-button {
      width: 422rpx;
      height: 96rpx;
      border-radius: 48rpx;

      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      line-height: 44rpx;
      font-style: normal;
      background: #006241;
      margin-top: 80rpx;
    }
  }
}
</style>
