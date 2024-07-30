<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import { EFusionTypes, FUSION_TYPES } from '../../fusion-analysis/fusion.constant'

const emits = defineEmits(['typeChange'])
const props = defineProps({
  currentType: {
    type: Number as PropType<EFusionTypes>,
  },
})
watch(
  () => props.currentType,
  (v) => {
    if (typeof v === 'number') activeType.value = v
  }
)

// tab功能
const activeType = ref(EFusionTypes.轨迹分析)
function onTabClick(value: EFusionTypes) {
  activeType.value = value
  emits('typeChange', value)
}
emits('typeChange', activeType.value)
</script>

<template>
  <div class="fusion-types">
    <ul class="fusion-types__content">
      <li
        :class="['fusion-types__item', activeType === tab.value && 'is-active']"
        v-for="(tab, index) in FUSION_TYPES"
        :key="index"
        @click="onTabClick(tab.value)"
      >
        <i :class="['iconfont', tab.icon, activeType === tab.value && 'is-active']"></i>
        <p>{{ tab.name }}</p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(fusion-types) {
  background: #fff;
  display: flex;
  height: 48px;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;

  @include e(content) {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: space-between;
    margin: 0;

    @include e(item) {
      display: flex;
      align-items: center;
      border-radius: 4px;
      color: #999;
      cursor: pointer;
      padding: 3px 9px 3px;
      position: relative;
      margin-right: 4px;
      &:last-child {
        margin-right: 0;
      }
      @include when(active) {
        background: #09f;
        color: #fff;
      }

      i {
        font-size: 14px;
        margin-right: 5px;
      }

      p {
        font-size: 14px;
        font-weight: 700;
        margin: 0;
      }
    }
  }
}
</style>
