<template>
  <div class="nearby">
    <map class="nearby__map" :latitude="lat" :longitude="lng" :markers="covers"></map>

    <image class="nearby__local" src="/static/local.png"></image>

    <div class="nearby__devices">
      <div class="device" v-for="i in 10" :key="i">
        <div class="top">
          <div class="name">No.9007 橘子水晶酒店咖啡机</div>
          <div class="distance">距离49m</div>
        </div>

        <div class="bottom">
          <div class="left">
            <div class="local">西湖区双龙街588号城西银泰城负一楼茶马花街B1020号</div>
            <div class="time">营业时间 10:00～22:00</div>
          </div>
          <image class="right" src="/static/daohang.png"></image>
        </div>

        <image class="checked" src="/static/checked.png"></image>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const lat = ref(39.909)
const lng = ref(116.39742)
const covers = ref([
  {
    id: 1,
    latitude: 39.9,
    longitude: 116.39,
    width: '40rpx',
    height: '52rpx',
    iconPath: '/static/nearby-local.png',
  },
  {
    id: 2,
    latitude: 39.909,
    longitude: 116.39742,
    width: '60rpx',
    height: '74rpx',
    iconPath: '/static/nearby-local.png',
    label: {
      content: '水晶大楼',
      textAlign: 'center',
      color: '#000',
      bgColor: '#fff',
      borderRadius: 10,
      padding: 4,
      anchorY: -66,
    },
  },
])
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(nearby) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  position: relative;

  @include e(map) {
    width: 100%;
    height: 464rpx;
  }
  @include e(local) {
    position: absolute;
    top: 374rpx;
    right: 32rpx;
    width: 58rpx;
    height: 58rpx;
  }
  @include e(devices) {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 24rpx;
    height: calc(100vh - 464rpx);
    overflow-y: auto;

    .device {
      width: 702rpx;
      background: #ffffff;
      border-radius: 24rpx;
      border: 2rpx solid #006241;
      margin-bottom: 24rpx;
      display: flex;
      flex-direction: column;
      padding: 32rpx;
      position: relative;

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;
        .name {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 32rpx;
          color: #000000;
          line-height: 44rpx;
          text-align: left;
          font-style: normal;
        }
        .distance {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #666666;
          line-height: 34rpx;
          text-align: right;
          font-style: normal;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;

        .left {
          display: flex;
          flex-direction: column;
          .local,
          .time {
            width: 426rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 24rpx;
            color: #666666;
            line-height: 36rpx;
            text-align: left;
            font-style: normal;
          }
          .time {
            margin-top: 8rpx;
          }
        }
        .right {
          width: 56rpx;
          height: 56rpx;
        }
      }

      .checked {
        position: absolute;
        right: -2rpx;
        bottom: 0;
        width: 84rpx;
        height: 84rpx;
      }
    }
  }
}
</style>
