<template>
  <div class="order-detail">
    <div class="order-detail__top">
      <div class="status">订单已完成</div>

      <div class="top-other">
        <div class="left">部分退款成功</div>
        <div class="right">￥15</div>
      </div>
    </div>

    <order-info></order-info>

    <div class="order-detail__detail">
      <van-cell-group class="cells">
        <van-cell title="订单编号" value="202303241420070001" />
        <van-cell title="下单时间" value="2023-06-19 17:00:31" />
        <van-cell title="支付方式" value="微信支付" />
        <van-cell title="支付时间" value="2023-06-19 17:01:20" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderInfo from './order-info.vue'
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
    height: 212rpx;
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
      margin-bottom: 32rpx;
    }
    .top-other {
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
