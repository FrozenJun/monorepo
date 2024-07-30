<script setup lang="ts">
import { ref, watch, PropType } from 'vue'
import FusionAnalysisPeer from './components/fusion-analysis-peer.vue'
import FusionAnalysisTrack from './components/fusion-analysis-track.vue'
import FusionAnalysisReside from './components/fusion-analysis-reside.vue'
import { message } from 'ant-design-vue'
import ResizeWrapper from '@/components/global/resize-wrapper/index.vue'
import { FusionControlModels } from './fusion.dto'
import { EFusionTypes } from './fusion.constant'
import { getNormalObjFromRes } from './fusion.util'
import DeviceInfo from '@/components/global/device-info/index.vue'
import { RetrievalControllerAPIService } from '@/api/modules/ams/services/retrieval-controller-api'
import { HOLOGRAM_DATA_TYPE_ENUM } from '@/api/modules/enum'
import BlendAnalysisController from '../blend-analysis/components/blend-analysis-controller.vue'
// 传入初始化id时，自动检索并选中第一个
const props = defineProps({
  objId: {
    type: String,
    default: '',
  },
  objType: {
    type: String as PropType<HOLOGRAM_DATA_TYPE_ENUM>,
    default: HOLOGRAM_DATA_TYPE_ENUM.人,
  },
  endTime: {
    type: Number,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
const objInfo = ref()
const loading = ref(false)
async function getPerson(id: string, type: string) {
  loading.value = true
  const { e, data } = await RetrievalControllerAPIService.getSubject({
    subjectType: type,
    subjectId: id as any,
  })
  loading.value = false
  if (e) return
  if (!data) return message.error('用户信息不存在')
  objInfo.value = getNormalObjFromRes(data)
}

watch(
  () => props.objId,
  (v) => {
    v && getPerson(v, props.objType)
  },
  {
    immediate: true,
  }
)

// 分析参数
const models = ref<FusionControlModels>()
function onModelsInit(controlModels: FusionControlModels) {
  models.value = controlModels
}

// 开始分析
const startAnalysisFlag = ref(false)
function onStartAnalysis(v) {
  startAnalysisFlag.value = true
  setTimeout(() => {
    startAnalysisFlag.value = false
  }, 0)
}

// 结束分析
const endSearch = ref(false)
function onEndSearch() {
  endSearch.value = true
  setTimeout(() => {
    endSearch.value = false
  }, 0)
}
</script>

<template>
  <ResizeWrapper class="fusion-analysis gl-map">
    <a-spin class="fusion-analysis__spin" :spinning="loading">
      <BlendAnalysisController
        :end-search="endSearch"
        @start-analysis="onStartAnalysis"
        @models-init="onModelsInit"
        :obj="objInfo"
        :endTime="endTime"
      ></BlendAnalysisController>
      <div class="gl-map__slik-third-wrapper">
        <div
          :class="[
            'gl-map__slik-third',
            models && models.type === EFusionTypes.轨迹分析 && 'is-first',
            models && models.type === EFusionTypes.同行分析 && 'is-second',
            models && models.type === EFusionTypes.落脚点分析 && 'is-third',
          ]"
        >
          <FusionAnalysisTrack
            class="gl-map__slik-third-item"
            :models="models"
            :startAnalysisFlag="startAnalysisFlag"
            @endSearch="onEndSearch"
          ></FusionAnalysisTrack>
          <FusionAnalysisPeer
            class="gl-map__slik-third-item"
            :models="models"
            :startAnalysisFlag="startAnalysisFlag"
            @endSearch="onEndSearch"
          ></FusionAnalysisPeer>
          <FusionAnalysisReside
            class="gl-map__slik-third-item"
            :models="models"
            :startAnalysisFlag="startAnalysisFlag"
            @endSearch="onEndSearch"
          ></FusionAnalysisReside>
        </div>
      </div>
    </a-spin>
  </ResizeWrapper>
  <DeviceInfo />
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(fusion-analysis) {
  position: relative;
  width: 100%;
  height: 100%;
  @include e(spin) {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @include e(content) {
    width: 100%;
    height: calc(100% - 48px);
  }
}
</style>
