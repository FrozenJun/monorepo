<template>
  <div class="order-info">
    <div class="device">No.9007 橘子水晶酒店咖啡机<van-icon name="arrow" /></div>
    <div class="divide"></div>
    <div class="goods">
      <div class="good" v-for="i in 5" :key="i">
        <order-good></order-good>
      </div>
    </div>

    <div class="expand">
      点击收起
      <image src="/static/arr-right@2x.png" />
    </div>
    <div class="divide-dash"></div>
    <div class="bottom">
      <div class="left">共三件商品</div>
      <div class="right">
        <div>总计：</div>
        <div class="price">
          ￥
          <div class="strong">39</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderGood from './order-good.vue'
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(order-info) {
  width: 702rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx 24rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24rpx;

  .device {
    width: 100%;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #000000;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .van-icon {
      margin-left: 12rpx;
    }
  }
  .divide {
    width: 654rpx;
    height: 2rpx;
    background-color: rgba(0, 0, 0, 0.06);
    margin-bottom: 30rpx;
  }
  .goods {
    display: flex;
    flex-direction: column;
    .good {
      margin-bottom: 32rpx;
    }
  }
  .expand {
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #666666;
    line-height: 34rpx;
    text-align: right;
    font-style: normal;
    margin-bottom: 32rpx;

    image {
      width: 24rpx;
      height: 24rpx;
      transform: rotate(90deg);
      margin-left: 16rpx;
    }
  }
  .divide-dash {
    width: 654rpx;
    height: 2rpx;
    border-bottom: 2px dashed #cccccc;
    margin-bottom: 22rpx;
  }
  .bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      line-height: 34rpx;
      text-align: left;
      font-style: normal;
    }
    .right {
      display: flex;
      align-items: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      line-height: 34rpx;
      text-align: right;
      font-style: normal;
      .price {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #fe5500;
        line-height: 28rpx;
        text-align: left;
        font-style: normal;
        display: flex;
        align-items: center;
        .strong {
          font-weight: 500;
          font-size: 36rpx;
          color: #fe5500;
          line-height: 50rpx;
        }
      }
    }
  }
}
</style>
