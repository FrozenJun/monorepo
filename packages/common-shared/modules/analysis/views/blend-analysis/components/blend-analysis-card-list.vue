<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import FusionObjEmpty from '../../../components/empty/fusion-obj-empty/index.vue'
import BlendAnalysisCard from './blend-analysis-card.vue'

const props = defineProps({
  data: {
    type: Array as PropType<any>,
    default: () => [],
  },
  cardListLoading: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  keyword: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['loadNextPageData', 'cardSelected'])

// cardList部分
const scrollContainer = ref()
function loadCardData() {
  const isAtBottom =
    scrollContainer.value.scrollTop + scrollContainer.value.clientHeight >=
    scrollContainer.value.scrollHeight
  if (isAtBottom) emits('loadNextPageData')
}
function onCardClick(value: Record<string, any>) {
  emits('cardSelected', value)
}
</script>

<template>
  <div
    class="blend-analysis-card-list gl-scroll-bar"
    ref="scrollContainer"
    @scroll="loadCardData()"
    v-if="visible"
  >
    <div class="blend-analysis-card-list__main">
      <a-spin :spinning="cardListLoading">
        <div
          class="blend-analysis-card-list__card"
          @click="onCardClick(cardItem)"
          v-for="cardItem in data"
        >
          <BlendAnalysisCard :cardItem="cardItem" style="cursor: pointer"></BlendAnalysisCard>
        </div>
        <!-- 检索结果为空展示empty组件 -->
        <div v-if="!(data && data.length)">
          <FusionObjEmpty
            class="blend-analysis-card-list__empty"
            :searched="!!keyword"
          ></FusionObjEmpty>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(blend-analysis-card-list) {
  @include e(main) {
    width: 100%;
    padding: 8px 20px 20px 20px;
  }

  @include e(card) {
    width: 320px;
    height: 130px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-top: 12px;
    &:hover {
      background: #ebf7ff;
    }
  }

  @include e(empty) {
    height: 100%;
  }
}
</style>
