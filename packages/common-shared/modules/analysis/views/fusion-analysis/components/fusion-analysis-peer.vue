<script setup lang="ts">
import { ref, computed, inject, Ref, watch, PropType, reactive } from 'vue'
import { TrackIcon } from '../../../components/map/map.dto'
import MapTrack from '../../../components/map/map-track/index.vue'
import { flyToBoundsByTracklines, trackVoToTrackIcons } from '../../../components/map/map.util'
import { FusionControlModels, FusionObj, FusionPeerTrackOption } from '../fusion.dto'
import { getNormalObjFromRes } from '../fusion.util'
import ArrowLeftOutlined from '@ant-design/icons-vue/ArrowLeftOutlined'
import { EFusionTypes } from '../fusion.constant'
import _ from 'lodash'
import TrackPeer from '../../../components/map/map-track/components/track-peer.vue'
import BlendAnalysisCard from '../../blend-analysis/components/blend-analysis-card.vue'
import { PaginationAdapter } from 'commom-core/ant-design/pagination/pagination.adapter'
import Pagination from 'commom-core/ant-design/pagination/pagination.vue'

const emits = defineEmits(['endSearch'])
const props = defineProps({
  models: {
    type: Object as PropType<FusionControlModels>,
    default: () => ({}),
  },
  option: { type: Object as PropType<FusionPeerTrackOption>, default: () => ({}) },
  startAnalysisFlag: Boolean,
})
watch(
  () => props.startAnalysisFlag,
  (v) => {
    if (v && props.models.type === EFusionTypes.同行分析) {
      getData()
    }
  }
)
// 获取高度
const resizeHeight = inject('resizeHeight', ref(0)) as Ref<number>
const style = computed(() => {
  return resizeHeight && resizeHeight.value ? { height: resizeHeight.value + 'px' } : undefined
})

// 地图相关
const mapTrack = ref()
const map = ref<L.Map>()
function onMapReady(mapInstance: L.Map) {
  map.value = mapInstance
}
// 获取同行人数据
const oldModels = ref('{}')
const isPure = ref(true)
watch(
  () => props.models,
  (models: FusionControlModels) => {
    if (!models.obj) {
      // 重新选择时情况重置图层
      unselectResultObj()
    }
    // 只有两种情况需要自动刷新
    // 1、type切到当前页并且检索目标变化
    // 2、type切到当前页并且第一次刷新
    const old = JSON.parse(oldModels.value)
    let isObjidChange = old.isObjidChange || old.objId !== models.obj?.id
    const isSwitchType = models.type === EFusionTypes.同行分析
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
// 获取同行信息loading
const loading = ref(false)
// 同行信息
const peerData = ref<any[]>([])
// 获取同行信息
async function getData() {
  if (!props.models.obj?.id) return
  unselectResultObj()
  peerData.value = []
  loading.value = true
  const track = await getTrackData(props.models.obj)
  trackData.value = track || []
  let params: Record<string, any> = {
    current: pagination?.current || 1,
    size: pagination?.pageSize || 5,
    timeGap: (props.models.timeOffset || 0) * 60, // 选择的是是分钟，转成秒
    frequency: props.models.minPeerCount!,
    trackPointCount: trackData.value.length,
    subjectId: props.models.obj?.subjectId || ('' as any),
    subjectType: props.models.obj?.subjectType || '',
    startTime: props.models.times ? props.models.times[0].format('YYYY-MM-DD HH:mm:ss') : '',
    endTime: props.models.times ? props.models.times[1].format('YYYY-MM-DD HH:mm:ss') : '',
  }
  if (props.option.accompanyparamsHandle && _.isFunction(props.option.accompanyparamsHandle)) {
    params = props.option.accompanyparamsHandle(props.models)
  }
  const { e, data } = await props.option.accompanyApi(params)
  loading.value = false
  if (e) return
  isPure.value = false
  emits('endSearch')
  if (props.option.usePagination) {
    pagination.total = data?.total
    peerData.value =
      data?.records?.map((i) => {
        const fusionObj = getNormalObjFromRes(i.subject as any)
        return {
          times: i.frequency,
          percentage: i.similarity + '%',
          ...i,
          ...fusionObj,
        }
      }) || []
  } else {
    pagination.total = data?.length
    peerData.value = data
  }
}
// 展示的同行信息
const peerList = computed(() => {
  return props.option.usePagination
    ? peerData.value
    : peerData.value.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize - 1
      )
})
// 选中的同行obj信息
const isResultSelected = ref(false)
const currentResultObj = ref<any>({})
// 点击同行结果列表卡片
async function onResultClick(data) {
  isResultSelected.value = true
  currentResultObj.value = data
  currentTrackData.value = []
  if (!props.models.obj) return
  trackLoading.value = true
  const currentTrack = await getTrackData({ ...data, subjectId: data.subjectId })
  currentTrackData.value = currentTrack || []
  trackLoading.value = false
}
// 重置选择
function unselectResultObj() {
  isResultSelected.value = false
  currentResultObj.value = undefined
  // 清空同行list 和 currentResultObj的轨迹信息
  currentTrackData.value = []
  // 关闭popup
  mapTrack.value && mapTrack.value.closeTrackPopup()
}

// 同行轨迹信息
const trackLoading = ref(false)
const trackData = ref<any[]>([]) // 检索目标的轨迹信息
const currentTrackData = ref<any[]>([])
const tracks = computed(() => {
  if (trackData.value.length && currentTrackData.value.length) {
    return [trackData.value, currentTrackData.value]
  } else {
    return []
  }
})
watch(
  () => tracks.value,
  (v) => {
    // 把flyToBoundsByTracklines写入tracks的computed中，会引起死循环，可能是把map当成了依赖
    if (v.length) flyToBoundsByTracklines([trackData.value, currentTrackData.value], map.value)
  }
)
// 获取轨迹数据
async function getTrackData(obj: FusionObj) {
  let params: Record<string, any> = {
    objTypes: props.models.deviceTypes as any,
    subjectId: obj?.subjectId || ('' as any),
    subjectType: obj?.subjectType || '',
    startTime: props.models.times ? props.models.times[0].format('YYYY-MM-DD HH:mm:ss') : '',
    endTime: props.models.times ? props.models.times[1].format('YYYY-MM-DD HH:mm:ss') : '',
  }
  if (props.option.paramsHandle && _.isFunction(props.option.paramsHandle)) {
    params = props.option.paramsHandle(props.models, obj)
  }
  const { e, data } = await props.option.api(params)
  if (e) return
  if (props.option.dataHandle && _.isFunction(props.option.dataHandle)) {
    return props.option.dataHandle(data)
  }
  return trackVoToTrackIcons(data, obj)
}
// 右侧结果中的轨迹信息
const trackPeerList = ref<TrackIcon[]>([])
function onGenTrackIcons(tracks: TrackIcon[]) {
  trackPeerList.value = tracks
}
const pagination = reactive<PaginationAdapter>({
  pageSize: 5,
  simple: true,
  onChange: (pageNo, pageSize) => {
    pagination.current = pageNo
    pagination.pageSize = pageSize
    props.option.usePagination && getData()
  },
})
</script>

<template>
  <div class="fusion-analysis-peer gl-map" :style="style">
    <div class="gl-map__map">
      <MapTrack
        ref="mapTrack"
        :tracks="tracks"
        :maxDiff="models?.timeOffset && models?.timeOffset * 60"
        @mapReady="onMapReady"
        @genTrackIcons="onGenTrackIcons"
      >
      </MapTrack>
    </div>

    <Transition name="slik-right-in">
      <div v-show="!!models.obj" class="gl-map__right-wrapper" style="width: 360px">
        <div class="gl-map__block-header">
          <h3>检索结果</h3>
          <div class="gl-map__header-operates" v-if="isResultSelected">
            <a @click="unselectResultObj"><arrow-left-outlined /> 选择对象</a>
          </div>
        </div>
        <div :class="['gl-map__slik-wrapper', isResultSelected && 'is-expand']">
          <!-- 同行结果 -->
          <div class="gl-map__slik-item">
            <a-spin :spinning="loading">
              <div class="fusion-analysis-peer__subject-list gl-scroll-bar" v-if="peerData.length">
                <BlendAnalysisCard
                  :key="item.subject?.subjectId"
                  v-for="item in peerList"
                  :card-item="item"
                  @click.native="onResultClick(item)"
                  class="fusion-analysis-peer__card"
                ></BlendAnalysisCard>
              </div>
              <div class="fusion-analysis-peer__empty" v-else><a-empty></a-empty></div>
              <div class="fusion-analysis-peer__footer" v-if="peerData.length">
                <div class="total">共{{ pagination.total || 0 }}条</div>
                <Pagination :c="pagination"></Pagination>
              </div>
            </a-spin>
          </div>
          <!-- 同行详情 -->
          <div class="gl-map__slik-item">
            <BlendAnalysisCard
              v-if="currentResultObj"
              :card-item="currentResultObj"
              style="padding: 0 12px"
            >
            </BlendAnalysisCard>
            <div class="fusion-analysis-peer__divider"></div>
            <TrackPeer
              :track-data="trackPeerList"
              class="fusion-analysis-peer__track-list"
            ></TrackPeer>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(fusion-analysis-peer) {
  width: 100%;
  height: 100%;
  @include e(right-header) {
    margin-bottom: 12px;
  }
  @include e(subject-list) {
    height: calc(100% - 48px);
    padding: 0 16px;
    overflow-y: auto;
    @include e(card) {
      cursor: pointer;
      &:hover {
        background: #ebf7ff;
      }
      margin-top: 12px;
      border: 1px solid rgba(0, 0, 0, 0.15);
    }

    @include e(empty) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 50vh;
    }
    @include e(footer) {
      .total {
        color: rgb(102, 102, 102);
      }
      padding: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  @include e(divider) {
    height: 8px;
    background: #f5f5f5;
  }
  @include e(track-list) {
    height: calc(100% - 48px);
  }
  .ant-spin-nested-loading {
    height: 100%;
  }
  .ant-spin-container {
    height: calc(100% - 40px);
  }
}
</style>
