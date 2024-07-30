<script setup lang="ts">
import { LMarker, LIcon } from '@vue-leaflet/vue-leaflet'
import { PropType, computed, ref } from 'vue'
import person from '@/assets/images/person.png'
import activePerson from '@/assets/images/person-active.png'
import { Marker } from '../map.dto'
const props = defineProps({
  marker: {
    type: Object as PropType<Marker>,
    default: () => ({}),
  },
  isActive: Boolean,
})
const marker = computed(() => {
  const color =
    props.marker.type === 'peer' ? 'red' : props.marker.theme === 'peer' ? 'green' : 'blue'
  return {
    ...props.marker,
    color,
  }
})
</script>

<template>
  <LMarker :lat-lng="marker.latLng || marker.device?.latLng" :key="marker.id">
    <LIcon>
      <div class="map-marker__content">
        <slot></slot>
        <div v-if="marker.iconType === 'track'">
          <div :class="['map-marker__index', `is-${marker.color}`]">
            {{ marker.index }}
          </div>
          <div class="map-marker__shadow"></div>
        </div>
        <img :src="isActive ? activePerson : person" v-else />
      </div>
    </LIcon>
  </LMarker>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-marker) {
  @include e(content) {
    position: relative;
    left: -50%;
    top: -28.2px;
    @include e(index) {
      position: relative;
      height: 28px;
      border-radius: 14px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
      font-size: 14px;
      color: #fff;
      line-height: 28px;
      text-align: center;
      padding: 0 8px;
      background: #bfbfbf;
      white-space: nowrap;
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 26px;
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-top-color: #bfbfbf;
      }

      @include when(blue) {
        background: #096dd9;
        &::after {
          border-top-color: #096dd9;
        }
      }
      @include when(red) {
        background: #ff5c5c;
        &::after {
          border-top-color: #ff5c5c;
        }
      }
      @include when(green) {
        background: rgba(88, 160, 90, 1);
        &::after {
          border-top-color: rgba(88, 160, 90, 1);
        }
      }
    }
    @include e(shadow) {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      top: 4px;
      border-radius: 50%;
      width: 12px;
      height: 6px;
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
