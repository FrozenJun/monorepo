<template>
  <div class="order-settle">
    <div class="order-settle__container">
      <order-info></order-info>

      <div class="order-settle__choose">
        <van-radio-group :value="radio" @change="onChange">
          <van-cell-group>
            <van-cell clickable data-name="1" @click="onClick">
              <view class="title" slot="title">
                <image src="/static/arr-right@2x.png" />
                <view class="text">余额（可用￥22.1）</view>
              </view>
              <van-radio slot="right-icon" name="1" checked-color="#006241" />
            </van-cell>
            <van-cell clickable data-name="2" @click="onClick">
              <view class="title" slot="title">
                <image src="/static/arr-right@2x.png" />
                <view class="text">微信支付</view>
              </view>
              <van-radio slot="right-icon" name="2" checked-color="#006241" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </div>

    <div class="order-settle__pay">
      <div class="left">
        <div class="desc">合计：</div>
        <div class="unit">￥</div>
        <div class="number">39.00</div>
      </div>
      <van-button>立即支付</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderInfo from './order-info.vue'

const radio = ref('1')
function onChange(e) {
  console.log(e)
}
function onClick(e: any) {
  radio.value = e.currentTarget.dataset?.name || ''
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
        align-items: center;
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
