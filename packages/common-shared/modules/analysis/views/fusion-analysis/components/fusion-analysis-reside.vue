<script setup lang="ts">
import { ref, computed, watch, nextTick, reactive, inject, Ref, PropType } from 'vue'
import { Marker, ResideMarker } from '../../../components/map/map.dto'
import * as L from 'leaflet'
import { flyToBoundsByPoints, getDurationBySeconds } from '../../../components/map/map.util'
import MapFootHold from '../../../components/map/map-reside/index.vue'
import { FusionControlModels, FusionResideOption } from '../fusion.dto'
import { EFusionTypes } from '../fusion.constant'
import { ResideDataTypeEnum } from '../../../components/map/map.constant'
import { PaginationAdapter } from 'commom-core/ant-design/pagination/pagination.adapter'
import ResideCardList from '../../../components/map/map-reside/components/reside-card-list.vue'
import _ from 'lodash'

const emits = defineEmits(['endSearch'])
const props = defineProps({
  models: {
    type: Object as PropType<FusionControlModels>,
    default: () => ({}),
  },
  startAnalysisFlag: Boolean,
  resideOption: {
    type: Object as PropType<FusionResideOption>,
    default: () => ({}),
  },
})
const tabs = reactive([
  {
    key: ResideDataTypeEnum.出现时长,
    tab: '出现时长',
  },
  {
    key: ResideDataTypeEnum.出现次数,
    tab: '出现次数',
  },
])
// 检索结果tabs绑定的key
const activeKey = ref(ResideDataTypeEnum.出现时长)
// 点击搜索才能改成分析类型，所以不能直接用props.models.dataType
const dataType = ref(ResideDataTypeEnum.出现时长)
watch(
  () => props.startAnalysisFlag,
  (v) => {
    if (v && props.models.type === EFusionTypes.落脚点分析) {
      dataType.value = props.models.dataType || ResideDataTypeEnum.出现时长
      getData()
    }
  }
)
watch(activeKey, (v) => {
  dataType.value = v || ResideDataTypeEnum.出现时长
  getData()
})

// 获取高度
const resizeHeight = inject('resizeHeight', ref(0)) as Ref<number>
const style = computed(() => {
  return resizeHeight && resizeHeight.value ? { height: resizeHeight.value + 'px' } : undefined
})

// 开始检索
const oldModels = ref('{}')
watch(
  () => props.models,
  (models: FusionControlModels) => {
    if (!models.obj) {
      // 重新选择时情况重置图层
      resideData.value = []
    }
    // 只有两种情况需要自动刷新
    // 1、type切到当前页并且检索目标变化
    // 2、type切到当前页并且第一次刷新
    const old = JSON.parse(oldModels.value)
    let isObjidChange = old.isObjidChange || old.objId !== models.obj?.id
    const isSwitchType = models.type === EFusionTypes.落脚点分析
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
// 落脚点数据
const resideData = ref<any[]>([])
// 地图打点 设备集合
const deviceData = computed(() => {
  const list = props.option.usePagination
    ? resideData.value
    : resideData.value.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize - 1
      )
  return list
    .sort((a, b) => {
      return dataType.value === '1' ? b.totalDuration - a.totalDuration : b.count - a.count
    })
    .map((i, index) => {
      const device = (i.devices && i.devices[0]) || {}
      const { lat, lon } = device.location || {}
      return {
        ...i,
        ...device,
        resideType: dataType.value,
        latLng: lat && lon && new L.LatLng(lat, lon),
        sort: index < 9 ? `0${index + 1}` : `${index + 1}`,
        count: dataType.value === '1' ? getDurationBySeconds(i.totalDuration) : i.count,
        unit: dataType.value === '1' ? '' : '次',
      }
    })
})
// 落脚点参数
const waypointParams = computed(() => ({
  subjectId: props.models.obj?.subjectId || ('' as any),
  subjectType: props.models.obj?.subjectType || '',
  startTime: props.models.times ? props.models.times[0].format('YYYY-MM-DD HH:mm:ss') : '',
  endTime: props.models.times ? props.models.times[1].format('YYYY-MM-DD HH:mm:ss') : '',
  sort: dataType.value === ResideDataTypeEnum.出现次数 ? 'collectCount' : 'duration',
}))
// 获取落脚点数据
async function getData() {
  if (!props.models.obj?.id) return
  resideData.value = []
  loading.value = true
  // 重置数据
  resideData.value = []
  // 关闭popup
  mapFoothold.value && mapFoothold.value.closeResidePopup()
  let params: Record<string, any> = {
    ...waypointParams.value,
    current: pagination?.current || 1,
    size: pagination?.pageSize || 12,
  }
  if (props.resideOption.paramsHandle && _.isFunction(props.resideOption.paramsHandle)) {
    params = props.resideOption.paramsHandle(props.models)
  }
  const { e, data } = await props.resideOption.api(params)
  loading.value = false
  if (e) return
  isPure.value = false
  emits('endSearch')
  if (props.resideOption.usePagination) {
    pagination.total = data?.total
    resideData.value = (data?.records || []).map((i, index) => {
      return { ...i, ...i.deviceGroup, deviceGroupId: i.deviceGroup?.id, sort: index + 1 }
    })
  } else {
    pagination.total = data.length
    resideData.value = props.resideOption.dataHandle(data)
  }
  nextTick(() => {
    flyToBoundsByPoints(
      deviceData.value.map((i) => i.latLng),
      map.value
    )
  })
}

// 地图相关
const map = ref<L.Map>()

// 点击地图图表列表反显
const currentActiveDevice = ref<ResideMarker>()
const cardList = ref()
function onResideIconCheckd(icon: ResideMarker) {
  currentActiveDevice.value = icon
  if (cardList.value) {
    const pagination = cardList.value.pagination
    const index = deviceData.value.findIndex((i) => i.id === icon.id)
    if (index === -1) return
    pagination.current = Math.ceil((index + 1) / pagination.pageSize)
  }
}
// 点击列表地图打开信息框
const mapFoothold = ref()
function onDeviceItemClick(data: Marker) {
  mapFoothold.value && mapFoothold.value.openResidePopup(data || {})
}

function onMapReady(mapInstance: L.Map) {
  map.value = mapInstance
}

const pagination = reactive<PaginationAdapter>({
  pageSize: 12,
  simple: true,
  onChange: (pageNo, pageSize) => {
    pagination.current = pageNo
    pagination.pageSize = pageSize
    props.resideOption.usePagination && getData()
  },
})
</script>

<template>
  <div class="fusion-analysis-reside gl-map" :style="style">
    <div class="gl-map__map">
      <MapFootHold
        ref="mapFoothold"
        @mapReady="onMapReady"
        :resideIcons="deviceData"
        :dataType="dataType"
        :waypointParams="waypointParams"
        @resideIconCheckd="onResideIconCheckd"
      ></MapFootHold>
    </div>

    <Transition name="slik-right-in">
      <div v-show="!!models.obj" class="gl-map__right-wrapper">
        <div class="gl-map__block-header fusion-analysis-reside__right-header">
          <div class="fusion-analysis-reside__res-title">检索结果</div>
        </div>
        <ResideCardList
          v-if="resideOption.onlyShowTime"
          :active-device-id="currentActiveDevice.id"
          :device-data="deviceData"
          :loading="loading"
          :on-card-click="onDeviceItemClick"
        ></ResideCardList>
        <a-tabs v-model:activeKey="activeKey" centered v-else>
          <a-tab-pane :key="item.key" :tab="item.tab" v-for="item in tabs">
            <a-spin :spinning="loading">
              <ResideCardList
                :active-device-id="currentActiveDevice.id"
                :device-data="deviceData"
                :loading="loading"
                :on-card-click="onDeviceItemClick"
              ></ResideCardList>
            </a-spin>
          </a-tab-pane>
        </a-tabs>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(fusion-analysis-reside) {
  width: 100%;
  height: 100%;
  @include e(search) {
    display: flex;
    flex-direction: column;
  }
  @include e(right-header) {
    @include e(res-title) {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 24px;
    }
    border-bottom: 0px;
  }
  @include e(card-list) {
    height: 100%;
    overflow-y: auto;
    @include e(card) {
      margin-top: 8px;
      cursor: pointer;
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
  }
  .ant-tabs {
    height: 100%;
  }
  .ant-tabs-content {
    height: 100%;
  }
  .ant-spin-nested-loading {
    height: 100%;
  }
  .ant-spin-container {
    height: calc(100% - 96px);
  }
}
</style>
