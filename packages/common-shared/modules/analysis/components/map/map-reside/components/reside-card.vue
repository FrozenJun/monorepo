<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  isActive: Boolean,
})
</script>

<template>
  <div :class="['reside-card', isActive && 'is-active']">
    <div class="reside-card__left">
      <div :class="['reside-card__index', Number(data.sort) <= 3 && 'is-red']">{{ data.sort }}</div>
      <div class="reside-card__name reside-card__count" :title="data.name">{{ data.name }}</div>
    </div>
    <div class="reside-card__count">{{ data.count }}{{ data.unit }}</div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(reside-card) {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include e(left) {
    display: flex;
    @include e(index) {
      position: relative;
      min-width: 24px;
      height: 24px;
      border-radius: 12px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
      font-size: 14px;
      color: #fff;
      line-height: 24px;
      text-align: center;
      padding: 0 4px;
      background: #bfbfbf;
      white-space: nowrap;
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 22px;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-top-color: #bfbfbf;
      }
      @include when(red) {
        background: #ff5c5c;
        &::after {
          border-top-color: #ff5c5c;
        }
      }
    }
    @include e(name) {
      margin-left: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 188px;
    }
  }
  @include e(count) {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
  @include when(active) {
    background-color: rgba(0, 0, 0, 0.04);
    @include e(name) {
      font-weight: 600;
    }
    @include e(count) {
      font-weight: 600;
    }
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
}
</style>
