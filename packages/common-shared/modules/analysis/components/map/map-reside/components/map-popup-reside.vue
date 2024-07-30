<script setup lang="ts">
import { PropType, reactive, ref, watch } from 'vue'
import { ResideMarker } from '../../map.dto'
import { LPopup } from '@vue-leaflet/vue-leaflet'
import { ResideDataTypeEnum } from '../../map.constant'
import dayjs from 'dayjs'
import { getDurationBySeconds, getIconByObjType } from '../../map.util'
import MapPopoverDevice from '../../map-track/components/map-popover-device.vue'
import { FusionResideOption } from '../../../../views/fusion-analysis/fusion.dto'

const props = defineProps({
  info: {
    type: Object as PropType<ResideMarker>,
    default: () => ({}),
  },
  dataType: String,
  waypointParams: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  resideOption: {
    type: Object as PropType<FusionResideOption>,
    default: () => ({}),
  },
})
const popupConfig: Partial<L.PopupOptions> = {
  offset: [-198, 220],
  className: 'map-popup-reside__popup',
}
const resideDetailData = ref<any[]>([])
const activeType = ref(ResideDataTypeEnum.出现时长)
const loading = ref(false)
// 获取停留详情数据
async function getData(dataType: ResideDataTypeEnum) {
  resideDetailData.value = []
  if (!props.info.id || !props.waypointParams.subjectId) return
  const api =
    dataType === ResideDataTypeEnum.出现时长
      ? props.resideOption.intervalApi
      : props.resideOption.collectApi
  loading.value = true
  const { e, data } = await api({
    ...props.waypointParams,
    deviceGroupId: props.info.deviceGroupId || '',
  })
  loading.value = false
  if (e) return
  resideDetailData.value = (data || []).map(footholdDetailPipe)
}
// 停留详情数据转化
function footholdDetailPipe(data: WaypointDeviceGroupIntervalVo) {
  if (data.startTime && data.endTime) {
    const intervalTime = data.startTime && data.endTime && `${data.startTime}-${data.endTime}`
    const second = dayjs(data.endTime).diff(dayjs(data.startTime)) / 1000
    return {
      ...data,
      intervalTime,
      duration: `停留：${getDurationBySeconds(second)}`,
    }
  }
  return data
}
watch(
  [() => props.info, () => props.dataType],
  ([v, type]) => {
    if (!v) return
    activeType.value = type
    getData(type)
  },
  { immediate: true }
)

watch(activeType, (v) => {
  getData(v)
})
const radioGroup = reactive([
  {
    label: '出现时长',
    value: ResideDataTypeEnum.出现时长,
  },
  {
    label: '出现次数',
    value: ResideDataTypeEnum.出现次数,
  },
])
function onRadioClick(dataType: ResideDataTypeEnum) {
  activeType.value = dataType
}
const URL = import.meta.env.VITE_BASE_URL
</script>

<template>
  <div class="map-popup-reside">
    <l-popup :options="popupConfig">
      <div class="map-popup-reside__name">{{ info.name }}</div>
      <div class="map-popup-reside__radio-group">
        <div
          :class="['map-popup-reside__radio', radio.value === activeType && 'is-active']"
          v-for="radio in radioGroup"
          @click="onRadioClick(radio.value)"
        >
          {{ radio.label }}
        </div>
      </div>
      <a-spin :spinning="loading">
        <div class="map-popup-reside__content gl-scroll-bar" v-if="resideDetailData.length">
          <div class="map-popup-reside__item" v-for="item in resideDetailData">
            <div class="map-popup-reside__left">
              <div class="map-popup-reside__obj-code">
                {{ item.objCode }}
              </div>
              <div class="map-popup-reside__img" v-if="item.extInfo?.bigImageUrl">
                <a-image :src="URL + item.extInfo?.bigImageUrl"></a-image>
              </div>
              <div class="map-popup-reside__collectTime" v-if="item.collectTime">
                {{ item.collectTime }}
              </div>
              <div class="map-popup-reside__interval" v-if="item.intervalTime">
                {{ item.intervalTime }}
              </div>
              <div class="map-popup-reside__duration" v-if="item.duration">
                {{ item.duration }}
              </div>
            </div>
            <div class="map-popup-reside__right">
              <MapPopoverDevice
                :device="info"
                :icon="getIconByObjType(item.objType)"
              ></MapPopoverDevice>
            </div>
          </div>
        </div>
        <a-empty v-else style="margin-top: 12px"></a-empty>
      </a-spin>
    </l-popup>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-popup-reside) {
  @include e(name) {
    background: #fafafa;
    padding: 14px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  @include e(radio-group) {
    display: flex;
    justify-content: space-between;
    padding: 2px;
    width: 85%;
    margin: 0 auto;
    height: 36px;
    background-color: rgba(240, 242, 245, 1);
    margin-top: 16px;
    @include e(radio) {
      cursor: pointer;
      height: 100%;
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 14px;
      color: #303133;
      @include when(active) {
        color: rgba(25, 137, 250, 1);
        background-color: rgba(255, 255, 255, 1);
      }
    }
  }
  @include e(content) {
    max-height: 600px;
    overflow-y: auto;
    padding: 16px;
    @include e(item) {
      bottom: 1px solid rgba(0, 0, 0, 0.06);
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 26px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      padding: 8px 0px;
      @include e(left) {
        @include e(obj-code) {
          color: rgba(0, 0, 0, 0.85);
        }
        @include e(img) {
          width: 50px;
          height: 50px;
          margin-bottom: 24px;
        }
      }
    }
  }

  @include e(popup) {
    width: 330px;
    min-width: 330px;
    background: #ffffff;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    .leaflet-popup-content {
      width: 100% !important;
      margin: 0;
    }
    .leaflet-popup-content-wrapper,
    .leaflet-popup-tip {
      background: none;
      box-shadow: none;
    }
  }
}
</style>
