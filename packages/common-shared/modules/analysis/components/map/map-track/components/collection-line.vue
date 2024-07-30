<script setup lang="ts">
import { PropType } from 'vue'
import CollectionLineCard from './collection-line-card.vue'
import { TrackCollectionLine } from '../../map.dto'

defineProps({
  data: {
    type: Array as PropType<TrackCollectionLine[]>,
    defauly: () => [],
  },
  // 是否是单人轨迹
  isSingle: Boolean,
})
</script>

<template>
  <div class="collection-line gl-scroll-bar">
    <a-timeline>
      <a-timeline-item v-for="item in data" :key="item.id">
        <template #dot>
          <div v-if="item.date" class="collection-line__dot-date"></div>
          <div v-else-if="isSingle" class="collection-line__dot-track">
            {{ item.index }}
          </div>
          <div v-else class="collection-line__dot"></div>
        </template>
        <CollectionLineCard :data="item"></CollectionLineCard>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(collection-line) {
  width: 100%;
  padding: 14px;
  max-height: 640px;
  overflow-y: auto;
  @include e(dot-date) {
    width: 12px;
    height: 12px;
    background: #1890ff;
    border-radius: 50%;
  }
  @include e(dot) {
    width: 6px;
    height: 6px;
    background: #f0f0f0;
    border-radius: 50%;
  }
  @include e(dot-track) {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    width: 16px;
    height: 16px;
    line-height: 12px;
    border-radius: 50%;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.65);
  }
  .ant-timeline-item {
    padding-bottom: 12px;
  }
}
</style>
