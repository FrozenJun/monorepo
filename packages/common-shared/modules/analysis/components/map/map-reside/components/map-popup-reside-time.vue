<script setup lang="ts">
import { LPopup } from '@vue-leaflet/vue-leaflet'
import { computed, PropType } from 'vue'
import { ResideMarker } from '../../map.dto'
import { getDurationBySeconds } from '../../map.util'
import { emit } from 'commom-core/utils/service/provider.service'
import dayjs from 'dayjs'

const props = defineProps({
  info: {
    type: Object as PropType<ResideMarker>,
    default: () => ({}),
  },
})
const popupConfig: Partial<L.PopupOptions> = {
  offset: [0, -67],
  className: 'map-popup-reside-time__popup',
}
const resideData = computed(() => {
  return {
    ...props.info,
    totalResideTime: getDurationBySeconds(props.info.totalResideTime),
    avgResideTime: getDurationBySeconds(props.info.avgResideTime),
    lastResideTime: dayjs(props.info.endTime).format('YYYY-MM-DD HH:mm:ss'),
  }
})

function openDeviceDetailModal(sn: string | undefined) {
  emit({ type: 'modal-open', name: 'device-detail' }, sn)
}
</script>

<template>
  <div class="map-popup-reside-time">
    <l-popup :options="popupConfig">
      <div class="map-popup-reside-time__info">
        <div class="title">
          <i :class="['iconfont', 'icon-IMSI']"></i>
          <a class="name" @click="openDeviceDetailModal(resideData.devSn)">{{
            resideData.devSn
          }}</a>
        </div>
        <div class="label">
          <label>点位名称：</label>
          <span> {{ resideData.devName }}</span>
        </div>
        <div class="label">
          <label>点位地址： </label>
          <span> {{ resideData.address }}</span>
        </div>
        <div class="label">
          <label>落脚次数排名：</label><span>{{ resideData.sort }}</span>
        </div>
        <div class="label">
          <label>最后落脚时间： </label><span>{{ resideData.lastResideTime }}</span>
        </div>
        <div v-if="resideData.totalResideTime" class="label">
          <label>落脚总时间： </label><span>{{ resideData.totalResideTime }}</span>
        </div>
        <div v-if="resideData.avgResideTime" class="label">
          <label>平均落脚时间：</label><span> {{ resideData.avgResideTime }} </span>
        </div>
        <div v-if="resideData.resideCount" class="label">
          <label>落脚次数 :</label><span> {{ resideData.resideCount }} </span>
        </div>
      </div>
    </l-popup>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-popup-reside-time) {
  @include e(info) {
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 6px;
    padding: 12px;
    .title {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      line-height: 24px;
      .name {
        padding-left: 10px;
        color: #1890ff;
      }
    }
    .label {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #262626;
      line-height: 22px;
      display: flex;
      // justify-content: start;
      // align-items: center;
      label {
        color: #8a8886;
        min-width: 60px;
        flex-shrink: 0;
      }
      span {
        display: inline-block;
        flex-shrink: 1;
      }
    }
  }
  @include e(popup) {
    width: 292px;
    min-width: 292px;
    background: #ffffff;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
    border-radius: 2px;

    .leaflet-popup-content {
      margin: 0;
    }
  }
}
</style>
