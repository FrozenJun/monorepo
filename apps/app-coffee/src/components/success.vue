<template>
  <div class="buy-result">
    <image src="/static/pickup-buy.png" />

    <div class="msg">购买成功</div>

    <van-cell-group class="cells">
      <van-cell title="实付" value="¥9.9" />
      <van-cell title="到账" value="1张提货码" />
      <van-cell title="支付方式" value="微信支付" />
    </van-cell-group>

    <van-button>立即享用</van-button>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(buy-result) {
  width: 750rpx;
  height: 100%;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;

  image {
    width: 114rpx;
    height: 112rpx;
    margin-top: 84rpx;
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
    margin-bottom: 112rpx;
  }

  .cells {
    width: 702rpx;
    background: #ffffff;
    border-radius: 24rpx;
    margin-bottom: 112rpx;

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
}
</style>
