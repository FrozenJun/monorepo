<script setup lang="ts">
import { PropType, computed, reactive, ref, watch } from 'vue'
import BlendAnalysisSearch from './blend-analysis-search.vue'
import BlendAnalysisCardList from './blend-analysis-card-list.vue'
import BlendAnalysisConfig from './blend-analysis-config.vue'
import { SubjectRetrievalVo } from '@/api/modules/ams/models/subject-retrieval-vo'
import { getNormalObjFromRes } from '../../fusion-analysis/fusion.util'
import DoubleRightOutlined from '@ant-design/icons-vue/DoubleRightOutlined'
import DoubleLeftOutlined from '@ant-design/icons-vue/DoubleLeftOutlined'
import { FusionObj } from '../../fusion-analysis/fusion.dto'
import { BlendOption } from '../blend.dto'
import _ from 'lodash'
defineEmits(['startAnalysis', 'modelsInit'])
// 窗口模式下的传过来的obj信息
const props = defineProps({
  obj: {
    type: Object as PropType<FusionObj>,
    default: () => ({}),
  },
  option: {
    type: Object as PropType<BlendOption>,
    default: () => ({}),
  },
})
// 当前选中的对象
const currentObj = ref<FusionObj>()

// BlendAnalysisSearch部分
const searchRef = ref()
const keyword = ref('')

// BlendAnalysisCardList部分
const records = ref<SubjectRetrievalVo[]>([])
const cardListData = computed(() => records.value.map(getNormalObjFromRes))
const cardListLoading = ref(false)
const cardListVisible = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})
async function getCardListData() {
  if (!keyword.value) return
  cardListLoading.value = true
  let params: Record<string, any> = {
    keyword: keyword.value,
  }
  if (props.option.paramsHandle && _.isFunction(props.option.paramsHandle)) {
    params = props.option.paramsHandle(params)
  }
  const { e, data } = await props.option.api({
    current: pagination.current,
    size: pagination.pageSize,
    ...params,
  })
  cardListLoading.value = false
  if (e) return
  pagination.total = data?.total || 0
  const addRecordsData = data?.records || []
  addRecordsData.map((v) => {
    records.value.push(v)
  })
  if (data?.total) searchRef.value.setSearchHistory(keyword.value)
}
function onCardListChange(value: any) {
  isSelected.value = false
  if (records.value && records.value.length) records.value = []
  pagination.current = 1
  typeof value === 'string' ? onSeachHistoryTag(value) : onTargetHistoryTag(value)
}
function onSeachHistoryTag(value: string) {
  keyword.value = value
  cardListVisible.value = true
  getCardListData()
  searchRef.value.isShowHistory = false
}
function onTargetHistoryTag(value: any) {
  keyword.value = value.label
  cardListVisible.value = true
  /**点击目标后直接跳转 */
  currentObj.value = value.origin
  isSelected.value = true
  searchRef.value.isShowHistory = false
  getCardListData()
}
function loadNextPageData() {
  const isLastPage = pagination.current * pagination.pageSize >= pagination.total
  if (isLastPage) return
  pagination.current++
  getCardListData()
}
async function onCardSelected(card) {
  currentObj.value = card
  isSelected.value = true
  searchRef.value.setTargetHistory({ name: card.name, key: card.id, origin: card })
}

// BlendAnalysisController部分
const isSelected = ref(false)
const isRetract = ref(false)

watch(
  () => props.obj,
  (obj) => {
    currentObj.value = obj
    cardListVisible.value = true
    isSelected.value = true
  }
)
</script>

<template>
  <div :class="['blend-analysis-controller', isRetract && 'is-retract']">
    <div :class="['blend-analysis-controller__container']">
      <BlendAnalysisSearch
        :keyword="keyword"
        ref="searchRef"
        @cardListChange="onCardListChange"
        @on-clear="keyword = ''"
      ></BlendAnalysisSearch>
      <div
        :class="['blend-analysis-controller__slik-wrapper', isSelected && 'is-expand']"
        v-if="cardListVisible"
      >
        <BlendAnalysisCardList
          class="blend-analysis-controller__slik-item"
          :data="cardListData"
          :cardListLoading="cardListLoading"
          :visible="cardListVisible"
          :keyword="keyword"
          @loadNextPageData="loadNextPageData()"
          @cardSelected="onCardSelected"
        ></BlendAnalysisCardList>
        <BlendAnalysisConfig
          class="blend-analysis-controller__slik-item"
          :obj="currentObj"
          :isSelected="isSelected"
          :end-search="($attrs.endSearch as any)"
          v-bind="$attrs"
          @changeIsSelected="isSelected = false"
          @start-analysis="
            (v) => {
              $emit('startAnalysis', v)
            }
          "
          @models-init="
            (v) => {
              $emit('modelsInit', v)
            }
          "
          @backToList="isSelected = false"
        ></BlendAnalysisConfig>
      </div>
    </div>
    <a
      class="blend-analysis-controller__retract"
      v-if="isSelected && !Object.keys(obj).length"
      @click="
        () => {
          isRetract = !isRetract
        }
      "
    >
      <div class="blend-analysis-controller__icon" v-if="isRetract">
        <double-right-outlined />
      </div>
      <div class="blend-analysis-controller__icon" v-else>
        <double-left-outlined />
      </div>
    </a>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(blend-analysis-controller) {
  position: absolute;
  width: 360px;
  height: 95%;
  z-index: 10;
  top: 16px;
  left: 14px;
  transition: left 0.3s ease;
  @include when(retract) {
    left: -360px;
  }
  @include e(container) {
    width: 100%;
    transition: left 0.3s ease;
    height: 100%;
    overflow: hidden;
    position: relative;
    left: 0px;
    @include e(slik-wrapper) {
      width: 200%;
      display: flex;
      max-height: calc(100% - 109px);
      left: 0;
      position: relative;
      transition: left 0.3s ease;
      @include e(slik-item) {
        width: 100%;
        max-height: 100%;
        background: #ffffff;
        box-shadow: 1px 2px 6px 0px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        margin-top: 8px;
      }
      @include when(expand) {
        left: -100%;
      }
    }
  }
  @include e(retract) {
    top: 50%;
    left: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 20px;
    height: 56px;
    background: #ffffff;
    box-shadow: 1px 2px 6px 0px rgba(0, 0, 0, 0.25);
    transform: perspective(0.5em) rotateY(3deg);
    color: rgba(102, 102, 102, 1);
    border-radius: 0px 6px 6px 0px;
    @include e(icon) {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
