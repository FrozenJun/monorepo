<script setup lang="ts">
import { LPopup } from '@vue-leaflet/vue-leaflet'
import { PropType, computed } from 'vue'
import { TrackCollectionLine, TrackIcon } from '../../map.dto'
import CollectionLine from '../components/collection-line.vue'
import MapTrackPeerLine from '../components/map-track-peer-line.vue'
import L from 'leaflet'
const props = defineProps({
  maxDiff: Number, // 最大时间差，单位秒
  popup: {
    type: Object as PropType<TrackIcon>,
    default: () => ({}),
  },
})
// 判断是不是同行点位
const isPeerPoint = computed(() => {
  return !!props.popup.peerFlagIndex
})
// 单人弹窗配置
const popupConfig = computed<Partial<L.PopupOptions>>(() => {
  return {
    offset: [-204, 120],
    className: 'map-popup-track__popup',
  }
})
// 同行点弹窗配置
const peerPopupConfig = computed<Partial<L.PopupOptions>>(() => {
  return {
    offset: [-224, 120],
    className: 'map-popup-track__peer-popup',
  }
})
// 非同行轨迹采集数据
const trackCollectionData = computed(() => {
  const res: TrackCollectionLine[] = []
  let index = 1
  props.popup.points?.forEach((item) => {
    item?.collections.forEach((collection) => {
      const date = collection.startTime?.split(' ')[0]
      if (!res.length || res.find((item) => item.date !== date)) {
        res.push({ date })
      }
      res.push({ ...collection, index, imsi: item.name })
      index++
    })
  })
  return res
})
</script>

<template>
  <!-- 同行点 -->
  <l-popup ref="popup" :options="peerPopupConfig" style="width: 380px" v-if="isPeerPoint">
    <div class="map-popup-track__header">
      <div class="map-popup-track__deviceName">{{ popup.device?.name }}</div>
    </div>
    <MapTrackPeerLine :tracks="[popup]" :is-detail="true"></MapTrackPeerLine>
  </l-popup>
  <!-- 普通点 -->
  <l-popup ref="popup" :options="popupConfig" style="width: 330px" v-else>
    <div class="map-popup-track__header">
      <div class="map-popup-track__deviceName">{{ popup.device?.name }}</div>
    </div>
    <CollectionLine :data="trackCollectionData" :is-single="true"></CollectionLine>
  </l-popup>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';
@mixin popup($width) {
  width: $width;
  min-width: $width;
  background: #ffffff;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  .leaflet-popup-content {
    margin: 0;
  }
  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: none;
    box-shadow: none;
  }
}
@include b(map-popup-track) {
  @include e(context) {
    display: flex;
    flex-direction: column;
    padding: 20px 20px 10px 10px;
    @include e(name) {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #262626;
      line-height: 28px;
      img {
        padding-right: 5px;
        padding-bottom: 3px;
      }
      .iconfont {
        margin-right: 8px;
      }
      span {
        white-space: nowrap;
      }

      @include e(title) {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: #262626;
        line-height: 28px;
        @include e(title-text) {
          max-width: 210px;
        }

        @include e(tag) {
          margin-left: 6px;
          display: inline-block;
          width: 48px;
          height: 22px;
          border-radius: 12px;
          text-align: center;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #ffffff;
          line-height: 22px;
        }
      }

      @include e(device-name) {
        width: 230px;
      }
    }
    @include e(info) {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #959595;
      padding-top: 5px;
      line-height: 24px;

      @include e(info-item) {
        display: flex;
        label {
          display: inline-block;
          width: 75px;
          flex-shrink: 0;
        }
        span {
          display: inline-block;
        }
      }
    }

    @include e(carousel) {
      width: 100%;
      .ant-image,
      .ant-image-img {
        width: 100%;
        height: 120px;
        object-fit: contain;
      }

      .slick-dots {
        position: relative;
        height: auto;
        li {
          width: 60px;
          height: 45px;
          &.slick-active {
            width: 60px;
            img {
              filter: grayscale(0%);
            }
          }
        }
        img {
          width: 100%;
          height: 100%;
          filter: grayscale(100%);
          display: block;
          object-fit: contain;
        }
      }
    }
  }
  @include e(footer) {
    display: flex;
    justify-content: end;
    background-color: #ffffff;
    flex-wrap: wrap;
    padding: 0 8px;
    margin: 8px 0;
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: auto;

    @include e(icon) {
      position: relative;
      z-index: 100;
      display: inline-block;
      width: 22px;
      height: 22px;
      border: 1px solid #e6e6e6;
      border-radius: 50%;
      background-color: #f6f6f6;
      margin-left: 8px;
      color: black;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
      margin-bottom: 3px;
      @include when(main) {
        background-color: rgba(#2d3c8b, 0.2);
      }
      @include when(peer) {
        background-color: rgba(#ff5c5c, 0.2);
      }
      @include when(active) {
        @include when(main) {
          border-color: #2d3c8b;
          background-color: #2d3c8b;
          color: #fff;
        }
        @include when(peer) {
          border-color: #ff5c5c;
          background-color: #ff5c5c;
          color: #fff;
        }
      }
      @include when(related) {
        @include when(main) {
          border: 1px solid #ff5c5c;
        }
        @include when(peer) {
          border: 1px solid #2d3c8b;
        }
      }
    }

    @include e(peer-icon) {
      background-color: rgba(#ed8856, 0.2);

      @include when(active) {
        border-color: #ed8856;
        background-color: #ed8856;
        color: #fff;
      }
    }

    @include e(peer-info) {
      width: 100%;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #959595;
      line-height: 24px;
      margin-left: 12px;
      margin-bottom: 5px;
    }
  }
  @include e(header) {
    background: #fafafa;
    border-radius: 3px 3px 0px 0px;
    border-bottom: 1px solid #e9e9e9;
    padding: 16px;
    @include e(deviceName) {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
  }

  @include e(popup) {
    @include popup(330px);
  }
  @include e(peer-popup) {
    @include popup(380px);
  }
}
</style>
