<template>
  <div class="pickup-item">
    <div class="left">
      <image :src="result.img" />

      <div class="pickup-item__main">
        <div class="name">{{ result.title }}</div>
        <div class="desc">{{ result.desc }}</div>
        <div v-if="result.code" class="code">
          {{
            result.type === PickupCodeUsageDetailType.提货码退回 ? '提货码退回：' : '已使用提货码：'
          }}
          <div :class="[result.type === PickupCodeUsageDetailType.提货码使用 && 'del']">
            {{ result.code }}
          </div>
        </div>
        <div class="time">{{ result.time }}</div>
      </div>
    </div>
    <div class="right" v-if="result.refunded">
      <div class="status">已退回</div>
    </div>

    <div v-if="!hiddenLine" class="line"></div>
  </div>
</template>

<script setup lang="ts">
import { PickupCodeUsageDetailType } from '@/app/api/services/enum'
import { computed, type PropType } from 'vue'
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
  switch (props.data?.type) {
    case PickupCodeUsageDetailType.提货码使用:
      img = '/static/coffee@2x.png'
      break
    case PickupCodeUsageDetailType.提货码购买:
      img = '/static/icon.png'
      break
    case PickupCodeUsageDetailType.提货码赠送:
      img = '/static/icon-give@2x.png'
      break
    case PickupCodeUsageDetailType.提货码退回:
      img = '/static/coffee-back.png'
  }
  return {
    ...props.data,
    img,
    time: dayjs(props.data.createdAt).format('MM-DD HH:mm'),
  }
})
</script>

<style lang="scss">
@import '@/styles/export.scss';

pickup-item {
  &:first-child {
    .pickup-item {
      border-top-left-radius: 24rpx;
      border-top-right-radius: 24rpx;
    }
  }
  &:last-child {
    .pickup-item {
      border-bottom-left-radius: 24rpx;
      border-bottom-right-radius: 24rpx;
    }
  }
}
@include b(pickup-item) {
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
      width: 48rpx;
      height: 48rpx;
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
    margin-left: 16rpx;
    .status {
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
