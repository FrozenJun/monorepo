<template>
  <div class="order-info">
    <div class="device" @tap="openLocation">
      {{ order.deviceInfo?.name || '未知设备' }}<van-icon name="arrow" />
    </div>
    <div class="divide"></div>
    <div class="goods">
      <div class="good" v-for="(i, index) in goods" :key="index">
        <order-good :good="i"></order-good>
      </div>
    </div>

    <div
      v-if="order.goods?.length > 2"
      @tap="isExpand = !isExpand"
      class="expand"
      :class="[isExpand && 'is-expanded']"
    >
      {{ isExpand ? '点击收起' : '展开全部' }}
      <image src="/static/arr-right@2x.png" />
    </div>
    <div v-if="order.payway === OrderPayway.提货码" class="count-line">
      <div class="left">使用提货码</div>
      <div class="right">
        <div class="price">
          -￥
          <div class="strong">{{ order.amount / 100 }}</div>
        </div>
      </div>
    </div>
    <div class="divide-dash"></div>
    <div class="count-line">
      <div class="left">共{{ (order as any).goodsCount || 0 }}件商品</div>
      <div class="right">
        <div>总计：</div>
        <div class="price">
          ￥
          <div class="strong">
            {{ order.payway === OrderPayway.提货码 ? 0 : (order.amount || 0) / 100 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import OrderGood from './order-good.vue'
import type { OrderDetailVo } from '@/app/api/models/order-detail-vo'
import { computed } from 'vue'
import { OrderPayway, OrderStatus } from '@/app/api/services/enum'

const props = defineProps({
  order: {
    type: Object as PropType<Record<string, any> & OrderDetailVo>,
    default: () => ({}),
  },
})
const goods = computed(() =>
  (props.order?.goods || []).filter((i, index) => isExpand.value || index < 2)
)

const isExpand = ref(false)

function openLocation() {
  const device = props.order.deviceInfo
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

    &.is-expanded {
      image {
        transform: rotate(270deg);
      }
    }
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
    margin-top: 32rpx;
  }
  .count-line {
    margin-top: 30rpx;
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
