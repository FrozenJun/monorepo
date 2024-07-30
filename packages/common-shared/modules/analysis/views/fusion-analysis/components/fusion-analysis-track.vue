<script setup lang="ts">
import { computed, inject, nextTick, Ref, ref, watch, PropType } from 'vue'
import { flyToBoundsByTracklines, trackVoToTrackIcons } from '../../../components/map/map.util'
import { TrackIcon } from '../../../components/map/map.dto'
import MapTrack from '../../../components/map/map-track/index.vue'
import { FusionControlModels, FusionBaseOption } from '../fusion.dto'
import { EFusionTypes } from '../fusion.constant'
import TrackList from '../../../components/map/map-track/components/track-list.vue'
import _ from 'lodash'
const emits = defineEmits(['endSearch'])
const props = defineProps({
  models: {
    type: Object as PropType<FusionControlModels>,
    default: () => ({}),
  },
  option: {
    type: Object as PropType<FusionBaseOption>,
    default: () => ({}),
  },
  startAnalysisFlag: Boolean,
})
// 获取高度
const resizeHeight = inject('resizeHeight', ref(0)) as Ref<number>
const style = computed(() => {
  return resizeHeight && resizeHeight.value ? { height: resizeHeight.value + 'px' } : undefined
})

const trackData = ref<any[]>([])
const tracks = computed(() => {
  if (!trackData.value || !trackData.value.length) return []
  return [trackData.value]
})
const activeIndexArr = ref<string[]>([])
// 地图点击列表反显
function onTrackIconCheckd(icon: TrackIcon) {
  activeIndexArr.value.length = 0
  trackData.value.forEach((item, index) => {
    if (item.device.id === icon.device.id) {
      activeIndexArr.value.push(item.index)
    }
  })
}

// 地图相关
const mapTrack = ref()
const map = ref<L.Map>()
function onMapReady(mapInstance: L.Map) {
  map.value = mapInstance
}
function onDeviceCheckd(item: Record<string, any>) {
  mapTrack.value && mapTrack.value.openTrackPopup(item)
}

// 开始检索
const oldModels = ref('{}')
watch(
  () => props.models,
  (models: FusionControlModels) => {
    if (!models.obj) {
      // 重新选择时情况重置图层
      trackData.value = []
    }
    // 只有两种情况需要自动刷新
    // 1、type切到当前页并且检索目标变化
    // 2、type切到当前页并且第一次刷新
    const old = JSON.parse(oldModels.value)
    let isObjidChange = old.isObjidChange || old.objId !== models.obj?.id
    const isSwitchType = models.type === EFusionTypes.轨迹分析
    const isFirst = isPure.value
    if (isSwitchType && (isObjidChange || isFirst) && props.models.obj?.id) {
      getData()
      isObjidChange = false
    }
    oldModels.value = JSON.stringify({
      type: models.type,
      objId: props.models.obj?.id || '',
      isObjidChange, // 有可能objid改变后没有立即切到此页，而改变了其它model,这里记录objId的改变
    })
  },
  {
    deep: true,
  }
)
const loading = ref(false)
const isPure = ref(true)
async function getData() {
  if (!props.models.obj?.id) return
  if (!props.models.times) return
  trackData.value = []
  loading.value = true
  // 关闭popup
  mapTrack.value && mapTrack.value.closeTrackPopup()
  let params: Record<string, any> = {
    objTypes: props.models.deviceTypes as any,
    subjectId: props.models.obj?.subjectId || ('' as any),
    subjectType: props.models.obj?.subjectType || '',
    startTime: props.models.times ? props.models.times[0].format('YYYY-MM-DD HH:mm:ss') : '',
    endTime: props.models.times ? props.models.times[1].format('YYYY-MM-DD HH:mm:ss') : '',
  }
  if (props.option.paramsHandle && _.isFunction(props.option.paramsHandle)) {
    params = props.option.paramsHandle(props.models)
  }
  const { e, data } = await props.option.api(params)
  loading.value = false
  if (e) return
  if (props.option.dataHandle && _.isFunction(props.option.dataHandle)) {
    trackData.value = props.option.dataHandle(data)
  } else {
    trackData.value = trackVoToTrackIcons(data, props.models.obj)
  }
  isPure.value = false
  emits('endSearch')
  nextTick(() => {
    flyToBoundsByTracklines(tracks.value, map.value)
  })
}
watch(
  () => props.startAnalysisFlag,
  (v) => {
    if (v && props.models.type === EFusionTypes.轨迹分析) {
      getData()
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="fusion-analysis-track gl-map" :style="style">
    <div class="gl-map__map">
      <MapTrack
        ref="mapTrack"
        :tracks="tracks"
        @trackIconCheckd="onTrackIconCheckd"
        @mapReady="onMapReady"
      ></MapTrack>
    </div>
    <Transition name="slik-right-in">
      <div v-show="!!models.obj" class="fusion-analysis-track__right-wrapper">
        <div class="gl-map__block-header fusion-analysis-track__right-header">
          <h3>检索结果</h3>
        </div>
        <TrackList :track-data="trackData" @on-card-click="onDeviceCheckd"></TrackList>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';
@include b(fusion-analysis-track) {
  width: 100%;
  height: 100%;

  @include e(search) {
    display: flex;
    flex-direction: column;
  }
  @include e(form) {
    width: 100%;
  }
  @include e(right-wrapper) {
    background-color: #fff;
    position: absolute;
    right: 14px;
    top: 16px;
    width: 360px;
    max-height: 95%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    box-shadow: 1px 2px 6px 0px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    @include e(track-list) {
      height: calc(100% - 48px);
    }
  }
}
</style>
