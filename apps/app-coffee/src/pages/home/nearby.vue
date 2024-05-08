<template>
  <div class="nearby">
    <map
      class="nearby__map"
      @markertap="onBindmarkertap"
      :latitude="lat"
      :longitude="lng"
      :markers="covers"
    ></map>

    <image v-if="isAuthed" @tap="toLocal" class="nearby__local" src="/static/local.png"></image>

    <div class="nearby__devices">
      <div
        class="device"
        :class="[activeId === i.id && 'active']"
        v-for="i in devices"
        :key="i.id"
        @tap="chooseDevice(i)"
      >
        <div class="top">
          <div class="name">{{ i.name }}</div>
          <div class="distance">距离{{ i.distanceText }}</div>
        </div>

        <div class="bottom">
          <div class="left">
            <div class="local">{{ i.addr }}</div>
            <!-- <div class="time">营业时间 10:00～22:00</div> -->
          </div>
          <image @tap="openLocation(i)" class="right" src="/static/daohang.png"></image>
        </div>

        <image v-if="activeId === i.id" class="checked" src="/static/checked.png"></image>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DeviceAPIService } from '@/app/api/services/device-api'
import { HideLoading, Loading, Toast } from '@/utils/toast'
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const lat = ref(39.908824)
const lng = ref(116.39747)
const userLat = ref()
const userLng = ref()
const devices = ref<any[]>([])
const activeId = ref(0)
const isLoaded = ref(false)
const isAuthed = ref(true)

const covers = computed(() => {
  return [
    ...devices.value.map((i) => {
      const active = activeId.value === i.id
      return {
        id: i.id,
        latitude: i.lat,
        longitude: i.lng,
        width: active ? '60rpx' : '40rpx',
        height: active ? '74rpx' : '52rpx',
        iconPath: '/static/nearby-local.png',
        label: active
          ? {
              content: i.name,
              textAlign: 'center',
              color: '#000',
              bgColor: '#fff',
              borderRadius: 10,
              padding: 4,
              anchorY: -66,
            }
          : undefined,
      }
    }),
    isAuthed.value &&
      userLat.value && {
        id: 8008,
        latitude: userLat.value,
        longitude: userLng.value,
        width: '60rpx',
        height: '60rpx',
        iconPath: '/static/my-local.png',
      },
  ].filter(Boolean)
})

onShow(getLocationByPermission)

function onBindmarkertap(e: any) {
  activeId.value = e.detail.markerId
  const device = devices.value.find((i) => i.id === activeId.value)
  if (device) {
    lat.value = device.lat
    lng.value = device.lng
    openLocation(device)
  }
}
function toLocal() {
  lat.value = userLat.value
  lng.value = userLng.value
}
function chooseDevice(i: any) {
  activeId.value = i.id
  lat.value = i.lat
  lng.value = i.lng
}
function openLocation(device: any) {
  wx.openLocation({
    latitude: device.lat,
    longitude: device.lng,
    address: device.addr,
    fail(e: any) {
      console.log('openLocation fail', e)
    },
  })
}
function getLocationByPermission() {
  wx.getSetting({
    success: (res: any) => {
      console.log('getLocationByPermission', res)
      // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
      // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
      // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
      if (
        res.authSetting['scope.userLocation'] != undefined &&
        res.authSetting['scope.userLocation'] == false
      ) {
        // 非第一次进入页面且未授权,可根据需求在此处做操作
        if (isLoaded.value) return
        getNearbyDevice()
        Toast('定位授权已关闭')

        isAuthed.value = false
      } else {
        // 获取用户位置经纬度
        getLocation()
      }
    },
  })
}
function getLocation() {
  wx.getLocation({
    type: 'gcj02',
    success(res: any) {
      // res包含用户位置经纬度、speed等
      lat.value = res.latitude
      userLat.value = res.latitude
      lng.value = res.longitude
      userLng.value = res.longitude
      isAuthed.value = true
      getNearbyDevice()
    },
    fail(res: any) {
      isAuthed.value = false
      console.log('getLocation fail', res)
      // 用户未给定位权限，打开城市选择器
      // 实践中发现安卓和苹果此处错误信息不同
      if (
        res.errMsg == 'getLocation:fail auth deny' ||
        res.errMsg == 'getLocation:fail:auth denied'
      ) {
        // 不做处理
      }
    },
  })
}
async function getNearbyDevice() {
  !isLoaded.value && Loading('加载中...')
  const { e, data } = await DeviceAPIService.deviceControllerGetNearby({
    lat: lat.value,
    lng: lng.value,
  })
  HideLoading()
  if (e) return
  isLoaded.value = true
  devices.value = (data || [])
    .filter((i: any, index: number) => index < 10)
    .map((i: any, index: number) => {
      return {
        ...i,
        id: Number(i.id),
        active: index === 0,
        distanceText:
          i.distance > 1000
            ? `${Math.round(i.distance / 100) / 10}km`
            : `${Math.round(i.distance)}m`,
      }
    })
  if (
    devices.value.length &&
    (!activeId.value || !devices.value.find((i) => i.id === activeId.value))
  ) {
    const device = devices.value[0]
    activeId.value = device.id
    lat.value = device.lat
    lng.value = device.lng
  }
}
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
      border: 2rpx solid #fff;
      margin-bottom: 24rpx;
      display: flex;
      flex-direction: column;
      padding: 32rpx;
      position: relative;
      transition: border-color 0.2s;
      &.active {
        border-color: #006241;
      }

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
        pointer-events: none;
      }
    }
  }
}
</style>
