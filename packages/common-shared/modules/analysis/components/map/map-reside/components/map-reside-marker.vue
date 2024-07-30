<script setup lang="ts">
import { ResideMarker } from '../../map.dto'
import { PropType, computed } from 'vue'
import MapMarker from '../../map-marker/index.vue'

const props = defineProps({
  icon: {
    type: Object as PropType<ResideMarker>,
    default: () => ({}),
  },
  isActive: {
    type: Boolean,
    default: false,
  },
})
const iconData = computed(() => {
  const index = Number(props.icon.sort)
  const color = index <= 3 ? 'red' : ''
  return {
    ...props.icon,
    color,
    iconType: 'track',
    index: props.icon.sort,
  }
})
</script>

<template>
  <MapMarker :class="['map-reside-marker']" :icon="iconData" :isActive="isActive" v-bind="$attrs">
    <template #default>
      <div class="map-reside-marker__container">
        <div :class="['map-reside-marker__data', Number(icon.sort) <= 3 && 'is-red']">
          <p class="detail">
            {{ (props.icon.count || '') + (icon.unit || '') }}
          </p>
        </div>
      </div>
    </template>
  </MapMarker>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-reside-marker) {
  @include e(container) {
    position: absolute;
    left: -5px;
    top: -25px;
    @include e(data) {
      display: flex;
      position: relative;
      min-width: 40px;
      height: 22px;
      background: #ffffff;
      border-radius: 100px 100px 100px 1px;
      border: 1px solid #5a6b74;
      @include when(red) {
        border: 1px solid #d94143;
      }
      .detail {
        padding: 2px 4px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 550;
        color: rgba(0, 0, 0, 0.85);
        white-space: nowrap;
      }
    }
  }
}
</style>
