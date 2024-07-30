<script setup lang="ts">
import { DEVICE_TYPE } from '@/api/modules/enum'
import { FormAdapter } from 'commom-core/ant-design/form/form.adapter'
import { computed, PropType, reactive, ref, watch } from 'vue'
import { EFusionTypes, FUSION_TYPES } from '../../fusion-analysis/fusion.constant'
import { FusionControlModels, FusionObj } from '../../fusion-analysis/fusion.dto'
import ArrowLeftOutlined from '@ant-design/icons-vue/ArrowLeftOutlined'
import BlendTypes from './blend-types.vue'
import BlendTime from './blend-time.vue'
import BlendSearch from './blend-search.vue'
import BlendDeviceType from './blend-device-type.vue'
import BlendAnalysisCard from './blend-analysis-card.vue'
import { Dayjs } from 'dayjs'

const props = defineProps({
  isSelected: {
    type: Boolean,
    default: false,
  },
  obj: {
    type: Object as PropType<FusionObj>,
    default: () => ({}),
  },
  endSearch: Boolean,
})
const emits = defineEmits(['startAnalysis', 'backToList', 'modelsInit'])
const currentObj = ref<FusionObj>()

// form部分
const models = reactive<FusionControlModels>({
  type: EFusionTypes.轨迹分析,
  times: undefined,
  // 轨迹分析
  deviceTypes: DEVICE_TYPE.map((i) => i.value),
  // 同行分析
  timeOffset: 3,
  minPeerCount: 2,
  minSimilarity: 20,
  // 落脚点
  dataType: '1',
})

watch(
  () => props.obj,
  (obj) => {
    if (Object.keys(obj).length) onObjChange({ obj, type: EFusionTypes.轨迹分析 })
  },
  {
    immediate: true,
  }
)

function onObjChange({ obj, type }) {
  currentObj.value = obj
  models.obj = obj
  models.type = type
  emits('modelsInit', models)
}

// block-header部分
const title = computed(() => {
  return FUSION_TYPES.find((item) => item.value === models.type)?.name
})
function unselectObj() {
  emits('backToList')
}

// card部分
const carInfo = computed(() => {
  return (currentObj.value?.vehicles || []).map((item) => item.plateNum)
})
const codeInfo = computed(() => {
  return (currentObj.value?.electronicGoodsList || []).map((item) => item.code)
})

const formTrack = reactive<FormAdapter>({
  itemWidth: '100%',
  layout: 'vertical',
  formItems: [
    {
      label: '感知要素类型',
      labelCol: { style: { width: '100px' } },
      prop: 'deviceTypes',
      type: 'slot',
      control: {
        name: 'deviceType',
      },
    },
  ],
  models,
})
const formPeer = reactive<FormAdapter>({
  itemWidth: '100%',
  layout: 'vertical',
  labelCol: { style: { width: '130px' } },
  formItems: [
    {
      label: '时间差',
      rules: 'required',
      prop: 'timeOffset',
      type: 'input-number',
      control: {
        min: 1,
        max: 60,
        step: 1,
        addonAfter: '分',
        precision: 0,
      },
    },
    {
      label: '同行次数不少于',
      rules: 'required',
      prop: 'minPeerCount',
      type: 'input-number',
      control: {
        min: 0,
        step: 1,
        addonAfter: '次',
        precision: 0,
      },
    },
  ],
  models,
})

// type部分
function onTypeChange(index: EFusionTypes) {
  models.type = index
}

// time部分
function onTimeChange(time: [Dayjs, Dayjs]) {
  models.times = time
}

// search部分
const loading = ref(false)
function onSearch() {
  loading.value = true
  models.obj = currentObj.value
  emits('startAnalysis', models)
}
watch(
  () => props.endSearch,
  (v) => {
    loading.value = false
  }
)
</script>

<template>
  <div class="blend-analysis-config gl-scroll-bar">
    <div class="blend-analysis-config__main" v-if="isSelected">
      <div class="gl-map__block-header">
        <h3>{{ title }}</h3>
        <div v-if="props.isSelected" class="gl-map__header-operates">
          <a @click="unselectObj"><arrow-left-outlined /> 重新选择</a>
        </div>
      </div>
      <div class="gl-map__content-wrapper">
        <div class="blend-analysis-config__card">
          <!-- 卡片与标题间断 -->
          <div class="blend-analysis-config__top-space"></div>
          <BlendAnalysisCard :cardItem="currentObj"></BlendAnalysisCard>
          <div v-if="carInfo.length || codeInfo.length">
            <div
              class="blend-analysis-config__dash-line"
              v-if="carInfo.length || codeInfo.length"
            ></div>
            <div class="blend-analysis-config__associated-info">
              <div class="blend-analysis-config__infomations" v-if="carInfo.length">
                车：
                <span v-for="car in carInfo" class="blend-analysis-config__info">
                  {{ car }}
                </span>
              </div>
              <div class="blend-analysis-config__infomations" v-if="codeInfo.length">
                码：
                <span v-for="code in codeInfo" class="blend-analysis-config__info">
                  {{ code }}
                </span>
              </div>
            </div>
          </div>
          <div class="blend-analysis-config__bottom-space"></div>
        </div>
        <BlendTypes @typeChange="onTypeChange" :currentType="models.type"></BlendTypes>
        <div class="gl-map__form">
          <BlendTime @timeChange="onTimeChange" :endTime="$attrs.endTime as any"></BlendTime>
          <c-form
            v-if="models.type === EFusionTypes.轨迹分析"
            class="blend-analysis-config__form"
            :c="formTrack"
          >
            <template #deviceType>
              <BlendDeviceType v-model="models!.deviceTypes"></BlendDeviceType>
            </template>
          </c-form>
          <c-form
            v-if="models.type === EFusionTypes.同行分析"
            class="blend-analysis-config__form"
            :c="formPeer"
          >
          </c-form>
          <c-form
            v-if="models.type === EFusionTypes.落脚点分析"
            class="blend-analysis-config__form"
          >
          </c-form>
        </div>
        <BlendSearch @search="onSearch" :loading="loading"></BlendSearch>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(blend-analysis-config) {
  position: relative;
  @include e(main) {
    width: 100%;
    background: #ffffff;
    box-shadow: 1px 2px 6px 0px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    height: 100%;
    min-height: 685px;
  }

  @include e(card) {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @include e(top-space) {
      width: 100%;
      height: 1px;
      background: rgba(0, 0, 0, 0.15);
    }

    @include e(dash-line) {
      width: 320px;
      height: 1px;
      background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
      background-size: 8px 1px;
      background-repeat: repeat-x;
    }

    @include e(associated-info) {
      width: 320px;
      margin-top: 7px;
      display: flex;
      flex-direction: column;
      align-items: center;

      @include e(infomations) {
        width: 288px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 20px;
        padding-top: 8px;
        &:last-child {
          margin-bottom: 16px;
        }

        @include e(info) {
          height: 100%;
          margin-right: 8px;
        }
      }
    }

    @include e(bottom-space) {
      width: 360px;
      height: 8px;
      background: #f5f5f5;
    }
  }

  @include e(form) {
    width: 100%;
  }
}
</style>
