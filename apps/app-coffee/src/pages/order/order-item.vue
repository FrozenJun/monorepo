<template>
  <div class="order-item">
    <div class="order-item__top">
      <div class="device" @tap="openLocation">
        {{ result.deviceInfo?.name || '未知设备' }} <van-icon name="arrow" />
      </div>

      <div @tap="toDetail" class="status" :class="[result.isCancle && 'cancled']">
        {{ result.isCancle ? '已退款' : '已完成' }}
      </div>
    </div>

    <div class="time" @tap="toDetail">{{ result.time }}</div>

    <div class="order-item__content" @tap="toDetail">
      <div class="goods">
        <div class="good" :class="['is-column']" v-for="(i, index) in result.goods" :key="index">
          <image mode="aspectFill" src="/static/coffee.png" />
          <div class="name">{{ `${i.name}${i.count > 1 ? `x${i.count}` : ''}` }}</div>
        </div>
      </div>

      <div class="count">
        <div class="count-price">
          ￥
          <div class="strong">{{ result.amount / 100 }}</div>
        </div>
        <div class="number">共 {{ result.goodsCount }} 件</div>
      </div>
    </div>

    <div class="order-item__divide" @tap="toDetail"></div>

    <div class="order-item__bottom" @tap="toDetail">
      <div class="bottom-left">
        <div v-if="result.isPartOk">成功退款￥{{ result.refundedAmount / 100 }}</div>
      </div>
      <div class="bottom-right">{{ result.paywayText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import dayjs from 'dayjs'
import { OrderPayway, OrderStatus } from '@/app/api/services/enum'

const props = defineProps({
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
})

const result = computed<Record<string, any>>(() => {
  let paywayText
  switch (props.data?.payway) {
    case OrderPayway.余额支付:
      paywayText = '余额支付'
      break
    case OrderPayway.微信支付:
      paywayText = '微信支付'
      break
    case OrderPayway.提货码:
      paywayText = '提货码支付 | 提货码：' + (props.data?.pickupCode || '未知提货码')
  }
  return {
    ...props.data,
    isOk: props.data.status === OrderStatus.已完成,
    isPartOk: props.data.status === OrderStatus.部分退款,
    isCancle: props.data.status === OrderStatus.已退款,
    paywayText,
    time: dayjs(props.data.payAt).format('YYYY-MM-DD HH:mm:ss'),
  }
})

function toDetail() {
  wx.navigateTo({
    url: '/pages/order/order-detail?id=' + result.value.id,
  })
}
function openLocation() {
  const device = props.data.deviceInfo
  wx.openLocation({
    latitude: device.lat,
    longitude: device.lng,
    fail(e: any) {
      console.log('openLocation fail', e)
    },
  })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(order-item) {
  width: 702rpx;
  background: #ffffff;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  position: relative;
  margin-bottom: 24rpx;

  @include e(top) {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8rpx;
    .device {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 28rpx;
      color: #000000;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      display: flex;
      align-items: center;

      .van-icon {
        margin-left: 12rpx;
      }
    }

    .status {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #666666;
      line-height: 40rpx;
      text-align: right;
      font-style: normal;

      &.cancled {
        color: #fe5500;
      }
    }
  }
  .time {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #666666;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    margin-bottom: 24rpx;
  }
  @include e(content) {
    width: 100%;
    overflow-y: auto;

    .goods {
      width: 100%;
      display: flex;

      .good {
        display: flex;
        align-items: center;
        margin-right: 16rpx;
        margin-bottom: 32rpx;
        image {
          width: 160rpx;
          height: 112rpx;
          border-radius: 8rpx;
          margin-right: 8rpx;
          object-fit: cover;
        }
        .name {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 28rpx;
          color: #333333;
          line-height: 32rpx;
          text-align: left;
          font-style: normal;
        }
        &.is-column {
          flex-direction: column;
          align-items: flex-start;
          image {
            margin-right: 0;
            margin-bottom: 12rpx;
          }
          .name {
            width: 160rpx;
            @include ellipsis();
          }
        }
      }
    }

    .count {
      width: 128rpx;
      height: 211rpx;
      background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0.5) 100%);
      position: absolute;
      right: 24rpx;
      top: 116rpx;
      z-index: 100;
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      padding: 42rpx 0 18rpx;

      .count-price {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
        line-height: 28rpx;
        text-align: right;
        font-style: normal;
        display: flex;
        align-items: flex-end;
        .strong {
          font-weight: 500;
          font-size: 32rpx;
          line-height: 44rpx;
        }
      }
      .number {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 34rpx;
        text-align: right;
        font-style: normal;
      }
    }
  }
  @include e(divide) {
    width: 654rpx;
    height: 2rpx;
    border-top: 2rpx dashed #cccccc;
    margin-bottom: 22rpx;
  }
  @include e(bottom) {
    display: flex;
    justify-content: space-between;

    .bottom-left {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #fe5500;
      line-height: 34rpx;
      text-align: right;
      font-style: normal;
    }
    .bottom-right {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      line-height: 34rpx;
      text-align: right;
      font-style: normal;
    }
  }
}
</style>
