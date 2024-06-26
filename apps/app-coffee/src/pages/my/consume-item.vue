<template>
  <div class="consume-item">
    <div class="left">
      <image mode="aspectFill" :src="result.img" />

      <div class="consume-item__main">
        <div class="name">{{ result.title }}</div>
        <div class="desc">{{ result.desc }}</div>
        <div class="time">{{ result.time }}</div>
      </div>
    </div>
    <div class="right">
      <div class="status" :class="[result.type === ConsumptionRecordType.微信退款 && 'is-add']">
        {{ result.amountText }}
      </div>
      <div v-if="result.refundedAmount" class="refund">
        {{
          result.refundedAmount === result.amount
            ? '已全额退款'
            : `已退款（￥${result.refundedAmount / 100}）`
        }}
      </div>
    </div>

    <div v-if="!hiddenLine" class="line"></div>
  </div>
</template>

<script setup lang="ts">
import { ConsumptionRecordType } from '@/app/api/services/enum'
import { type PropType, computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  hiddenLine: Boolean,
})

const result = computed<Record<string, any>>(() => {
  let img
  let amountText
  switch (props.data?.type) {
    case ConsumptionRecordType.余额充值:
      img = '/static/wc-pay.png'
      amountText = '-' + props.data?.amount / 100
      break
    case ConsumptionRecordType.提货码购买:
      img = '/static/wc-pay.png'
      amountText = '-' + props.data?.amount / 100
      break
    case ConsumptionRecordType.订单支付:
      img = '/static/coffee@2x.png'
      amountText = '-' + props.data?.amount / 100
      break
    case ConsumptionRecordType.微信退款:
      img = '/static/coffee-back.png'
      amountText = '+' + props.data?.amount / 100
  }
  return {
    ...props.data,
    img,
    amountText,
    time: dayjs(props.data.createdAt).format('MM-DD HH:mm'),
  }
})
</script>

<style lang="scss">
@import '@/styles/export.scss';

consume-item {
  &:first-child {
    .consume-item {
      border-top-left-radius: 24rpx;
      border-top-right-radius: 24rpx;
    }
  }
  &:last-child {
    .consume-item {
      border-bottom-left-radius: 24rpx;
      border-bottom-right-radius: 24rpx;
    }
  }
}
@include b(consume-item) {
  width: 702rpx;
  display: flex;
  padding: 32rpx 24rpx 34rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  position: relative;

  .left {
    display: flex;

    image {
      width: 60rpx;
      height: 60rpx;
      margin-right: 24rpx;
    }

    @include e(main) {
      flex-direction: column;
      display: flex;
      flex: 1;

      .name {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        margin-bottom: 16rpx;
      }
      .desc {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 34rpx;
        text-align: left;
        font-style: normal;
        margin-bottom: 16rpx;
      }
      .code {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 34rpx;
        text-align: left;
        font-style: normal;
        margin-bottom: 16rpx;
        display: flex;
        align-items: center;
      }
      .del {
        text-decoration-line: line-through;
      }
      .time {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #888888;
        line-height: 34rpx;
        text-align: left;
        font-style: normal;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: 16rpx;
    .status {
      font-family: DINPro, DINPro;
      font-weight: 500;
      font-size: 36rpx;
      color: #000000;
      line-height: 46rpx;
      text-align: right;
      font-style: normal;

      &.is-add {
        color: #fe5500;
      }
    }
    .refund {
      margin-top: 8rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #ff8f1f;
      line-height: 34rpx;
      text-align: right;
      font-style: normal;
    }
  }

  .line {
    position: absolute;
    left: 96rpx;
    bottom: 0;
    width: 606rpx;
    height: 4rpx;
    background-color: #efefef;
  }
}
</style>
