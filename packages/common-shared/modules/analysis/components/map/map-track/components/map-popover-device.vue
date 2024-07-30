<script setup lang="ts">
import { PropType } from 'vue'

defineProps({
  placement: {
    type: String as PropType<'right' | 'left'>,
    default: 'right',
  },
  device: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="map-popover-device">
    <a-popover :placement="placement" trigger="hover">
      <template #content>
        <div class="map-popover-device__info">
          <label class="label">设备编号：</label>
          <span>{{ device.sn }}</span>
        </div>
        <div class="map-popover-device__info">
          <label class="label">经纬度：</label>
          <span>{{ device.location?.lon }}，{{ device.location?.lat }}</span>
        </div>
        <div class="map-popover-device__info" v-if="device.type">
          <label class="label">设备类型：</label>
          <span>{{ DEVICE_TYPE.find((item) => item.value === device.type)?.label }}</span>
        </div>
      </template>
      <template #title>
        <div class="map-popover-device__title">{{ device?.name }}</div>
      </template>
      <i :class="['iconfont', 'icon-IMSI', 'map-popover-device__icon']"></i
    ></a-popover>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-popover-device) {
  font-family: PingFangSC-Regular, PingFang SC;
  @include e(info) {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    .label {
      color: rgba(0, 0, 0, 0.65);
    }
    padding-bottom: 8px;
  }
  @include e(title) {
    font-weight: 550;
    color: rgba(0, 0, 0, 0.85);
  }
  @include e(icon) {
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    &:hover {
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
